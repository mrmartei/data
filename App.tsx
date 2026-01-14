import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import BuyData from './components/BuyData.tsx';
import History from './components/History.tsx';
import Dashboard from './components/Dashboard.tsx';
import Admin from './components/Admin.tsx';
import Login from './components/Login.tsx';
import { ViewType, Transaction, DataPlan, User } from './types.ts';

const INITIAL_PLANS: DataPlan[] = [
  { id: '1', network: 'MTN', size: '1GB', price: 10, validity: '30 Days' },
  { id: '2', network: 'MTN', size: '5GB', price: 40, validity: '30 Days' },
  { id: '3', network: 'Telecel', size: '1.5GB', price: 12, validity: '30 Days' },
  { id: '4', network: 'AT', size: '2GB', price: 10, validity: '30 Days' },
];

const SUPER_ADMIN: User = {
  id: 'USR-ROOT',
  name: 'dev team',
  email: 'themediaplace7@gmail.com',
  password: 'lumen99devaccess',
  balance: 0,
  avatar: 'https://i.pravatar.cc/150?u=devteam',
  role: 'admin',
  joinedDate: '01-Jan-2023'
};

const MOCK_CLIENTS: User[] = [
  SUPER_ADMIN,
  { id: 'U1', name: 'Kwame Mensah', phone: '0244123456', password: 'password123', balance: 50, avatar: 'https://i.pravatar.cc/150?u=u1', role: 'user', joinedDate: '12-Oct-2023' },
  { id: 'U2', name: 'Abena Serwaa', phone: '0205123456', password: 'password456', balance: 20, avatar: 'https://i.pravatar.cc/150?u=u2', role: 'user', joinedDate: '15-Oct-2023' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewType>('dashboard');
  const [clients, setClients] = useState<User[]>(MOCK_CLIENTS);
  const [plans, setPlans] = useState<DataPlan[]>(INITIAL_PLANS);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-G98213', type: 'Data', amount: 40, status: 'Success', date: '20-11-2023', recipient: '0244123456', plan: 'MTN 5GB' },
    { id: 'TX-G98214', type: 'Data', amount: 10, status: 'Success', date: '20-11-2023', recipient: '0205123456', plan: 'Telecel 1GB' },
  ]);

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
        phone: role === 'user' ? identifier : undefined,
        email: role === 'admin' ? identifier : undefined,
        password: pass,
        balance: 0,
        avatar: `https://i.pravatar.cc/150?u=${identifier}`,
        role,
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setClients(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setView('dashboard');
    } else {
      alert("Invalid credentials. Please sign up if you don't have an account.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setView('login');
  };

  const handleDataPurchase = (plan: DataPlan, phone: string) => {
    const newTx: Transaction = {
      id: `TX-G${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Data',
      amount: plan.price,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-GB'),
      recipient: phone,
      plan: `${plan.network} ${plan.size}`
    };

    setTransactions(prev => [newTx, ...prev]);
    alert(`Order for ${phone} is processing. Our admins will verify payment.`);
    setView('history');
  };

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status } : tx));
  };

  const deleteClient = (id: string) => {
    if (confirm("Are you sure?")) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateUserPassword = (id: string, newPass: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, password: newPass } : c));
    alert("Password updated successfully.");
  };

  const handleAddPlan = (newPlan: Omit<DataPlan, 'id'>) => {
    const plan: DataPlan = { ...newPlan, id: Math.random().toString(36).substr(2, 9) };
    setPlans(prev => [...prev, plan]);
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
      balance: 0,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      role: 'admin',
      joinedDate: new Date().toLocaleDateString('en-GB')
    };
    setClients(prev => [...prev, newAdmin]);
    alert(`Admin ${name} created successfully.`);
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
            onUpdateStatus={updateTransactionStatus} 
            onDeleteClient={deleteClient}
            onUpdateUserPassword={updateUserPassword}
            onAddPlan={handleAddPlan}
            onDeletePlan={handleDeletePlan}
            onAddAdmin={handleAddAdmin}
          />
        );
      case 'settings':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Settings</h2>
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Account</p>
                  <p className="text-sm text-indigo-600 font-medium">{currentUser?.phone || currentUser?.email}</p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{currentUser?.role}</span>
              </div>
              <button onClick={handleLogout} className="w-full text-center py-4 text-red-600 font-bold border border-red-100 rounded-2xl hover:bg-red-50 transition-colors">
                Sign Out
              </button>
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
      balance={currentUser?.balance || 0}
      userRole={currentUser?.role}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;