import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import BuyData from './components/BuyData.tsx';
import History from './components/History.tsx';
import Dashboard from './components/Dashboard.tsx';
import Admin from './components/Admin.tsx';
import Login from './components/Login.tsx';
import { ViewType, Transaction, DataPlan, User } from './types.ts';
import { User as UserIcon, Shield } from 'lucide-react';

const SUPER_ADMIN: User = {
  id: 'USR-ROOT',
  name: 'Dev Admin',
  email: 'themediaplace7@gmail.com',
  password: 'lumen99devaccess',
  avatar: 'https://i.pravatar.cc/150?u=devadmin',
  role: 'admin',
  joinedDate: '01-Jan-2024'
};

const INITIAL_PLANS: DataPlan[] = [
  { id: 'mtn-1', network: 'MTN', size: '1GB', price: 7 },
  { id: 'mtn-2', network: 'MTN', size: '2GB', price: 13 },
  { id: 'mtn-3', network: 'MTN', size: '3GB', price: 17 },
  { id: 'mtn-4', network: 'MTN', size: '4GB', price: 24 },
  { id: 'mtn-5', network: 'MTN', size: '5GB', price: 28 },
  { id: 'at-1', network: 'AT', size: '1GB', price: 5 },
  { id: 'at-2', network: 'AT', size: '2GB', price: 8 },
];

const App: React.FC = () => {
  const [clients, setClients] = useState<User[]>(() => {
    const saved = localStorage.getItem('ds_clients');
    let loadedClients: User[] = saved ? JSON.parse(saved) : [SUPER_ADMIN];
    const adminIdx = loadedClients.findIndex(c => c.email === SUPER_ADMIN.email);
    if (adminIdx === -1) {
      loadedClients.push(SUPER_ADMIN);
    } else {
      loadedClients[adminIdx] = { ...loadedClients[adminIdx], ...SUPER_ADMIN };
    }
    return loadedClients;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('ds_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ds_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<ViewType>(() => {
    const saved = localStorage.getItem('ds_view');
    return (saved as ViewType) || 'dashboard';
  });

  const [plans, setPlans] = useState<DataPlan[]>(() => {
    const saved = localStorage.getItem('ds_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ds_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ds_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('ds_auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('ds_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ds_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('ds_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('ds_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = (identifier: string, pass: string, role: 'user' | 'admin', name?: string) => {
    const existing = clients.find(c => 
      (c.phone === identifier || c.email === identifier) && 
      c.password === pass
    );

    if (existing) {
      setCurrentUser(existing);
      setIsAuthenticated(true);
      setView('dashboard');
      return;
    }

    if (name) {
      const newUser: User = {
        id: `USR-${Math.random().toString(36).substr(2, 5)}`,
        name,
        phone: identifier.includes('@') ? undefined : identifier,
        email: identifier.includes('@') ? identifier : undefined,
        password: pass,
        avatar: `https://i.pravatar.cc/150?u=${identifier}`,
        role: 'user', 
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setClients(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setView('dashboard');
    } else {
      alert("Account not found. Check your credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setView('dashboard');
    localStorage.removeItem('ds_auth');
    localStorage.removeItem('ds_user');
    localStorage.removeItem('ds_view');
  };

  const handleDataPurchase = (plan: DataPlan, phone: string) => {
    const newTx: Transaction = {
      id: `TX-G${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Data',
      amount: plan.price,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-GB'),
      recipient: phone,
      plan: `${plan.network} ${plan.size}`,
      network: plan.network
    };

    setTransactions(prev => [newTx, ...prev]);
    setView('history');
  };

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status } : tx));
  };

  const deleteClient = (id: string) => {
    if (confirm("Permanently remove this user?")) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateUserPassword = (id: string, newPass: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, password: newPass } : c));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, password: newPass } : null);
    }
    alert("Updated.");
  };

  const updateAccount = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setClients(prev => prev.map(c => c.id === currentUser.id ? updated : c));
    setCurrentUser(updated);
    alert("Profile updated successfully.");
  };

  const handleAddPlan = (newPlan: Omit<DataPlan, 'id'>) => {
    const plan: DataPlan = { ...newPlan, id: Math.random().toString(36).substr(2, 9) };
    setPlans(prev => [...prev, plan]);
  };

  const handleUpdatePlan = (updatedPlan: DataPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  const handleDeletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleAddAdmin = (email: string, name: string, pass: string) => {
    const newAdmin: User = {
      id: `ADM-${Math.random().toString(36).substr(2, 5)}`,
      name,
      email,
      password: pass,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      role: 'admin',
      joinedDate: new Date().toLocaleDateString('en-GB')
    };
    setClients(prev => [...prev, newAdmin]);
    alert(`Admin ${name} created.`);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard transactions={transactions} setView={setView} userRole={currentUser?.role} />;
      case 'buy-data':
        if (currentUser?.role === 'admin') return <Dashboard transactions={transactions} setView={setView} userRole={currentUser?.role} />;
        return <BuyData onPurchase={handleDataPurchase} plans={plans} />;
      case 'history':
        return <History transactions={transactions} />;
      case 'admin':
        if (currentUser?.role !== 'admin') return <Dashboard transactions={transactions} setView={setView} userRole={currentUser?.role} />;
        return (
          <Admin 
            transactions={transactions} 
            clients={clients}
            plans={plans}
            currentUser={currentUser!}
            onUpdateStatus={updateTransactionStatus} 
            onDeleteClient={deleteClient}
            onUpdateUserPassword={updateUserPassword}
            onAddPlan={handleAddPlan}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
            onAddAdmin={handleAddAdmin}
          />
        );
      case 'settings':
        return (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <UserIcon size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-slate-800">Account Management</h2>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Update your security and profile</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={currentUser?.name}
                      onBlur={(e) => updateAccount({ name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 ml-1">Email / Phone</label>
                    <input 
                      type="text" 
                      disabled
                      value={currentUser?.email || currentUser?.phone}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="text-indigo-600" size={18} />
                    <div>
                      <p className="text-xs font-medium text-indigo-900">Security Access</p>
                      <p className="text-[10px] text-indigo-500 capitalize">{currentUser?.role} Status</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const newPass = prompt("Enter new password:");
                      if (newPass) updateUserPassword(currentUser!.id, newPass);
                    }}
                    className="text-[11px] font-medium text-indigo-600 bg-white px-4 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all"
                  >
                    Change Password
                  </button>
                </div>

                <button onClick={handleLogout} className="w-full text-center py-4 text-red-500 font-medium border border-red-100 rounded-2xl hover:bg-red-50 transition-colors">
                  Sign Out Securely
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard transactions={transactions} setView={setView} userRole={currentUser?.role} />;
    }
  };

  return (
    <Layout 
      currentView={view} 
      setView={setView} 
      userRole={currentUser?.role}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;