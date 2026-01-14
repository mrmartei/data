
import React, { useState } from 'react';
import { Transaction, User, DataPlan } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Clock, 
  Package,
  Users,
  Trash2,
  Plus,
  Signal,
  LayoutGrid,
  Eye,
  EyeOff,
  Key,
  ShieldAlert
} from 'lucide-react';

interface AdminProps {
  transactions: Transaction[];
  clients: User[];
  plans: DataPlan[];
  onUpdateStatus: (id: string, status: Transaction['status']) => void;
  onDeleteClient: (id: string) => void;
  onUpdateUserPassword: (id: string, newPass: string) => void;
  onAddPlan: (plan: Omit<DataPlan, 'id'>) => void;
  onDeletePlan: (id: string) => void;
  onAddAdmin: (email: string, name: string, pass: string) => void;
}

const Admin: React.FC<AdminProps> = ({ 
  transactions, 
  clients, 
  plans, 
  onUpdateStatus, 
  onDeleteClient, 
  onUpdateUserPassword,
  onAddPlan, 
  onDeletePlan,
  onAddAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'clients' | 'plans' | 'staff'>('orders');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'All'>('All');
  const [activeNetwork, setActiveNetwork] = useState<DataPlan['network']>('MTN');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Form states
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', name: '', password: '' });
  const [newPlan, setNewPlan] = useState<Omit<DataPlan, 'id'>>({ network: 'MTN', size: '', price: 0, validity: '30 Days' });

  const stats = {
    totalSales: transactions.filter(t => t.status === 'Success').reduce((acc, curr) => acc + curr.amount, 0),
    pendingOrders: transactions.filter(t => t.status === 'Pending').length,
    totalOrders: transactions.length,
    failedOrders: transactions.filter(t => t.status === 'Failed').length,
    totalClients: clients.filter(c => c.role === 'user').length,
    totalStaff: clients.filter(c => c.role === 'admin').length
  };

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetPassword = (id: string) => {
    const newPass = prompt("Enter new password:");
    if (newPass && newPass.length >= 6) {
      onUpdateUserPassword(id, newPass);
    } else if (newPass) {
      alert("Password must be at least 6 characters.");
    }
  };

  const filteredOrders = transactions.filter(t => {
    const matchesSearch = t.recipient.includes(searchTerm) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredClients = clients.filter(c => c.role === 'user' && (
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm)
  ));

  const filteredStaff = clients.filter(c => c.role === 'admin' && (
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email?.includes(searchTerm)
  ));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Admin Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <button 
          onClick={() => { setStatusFilter('All'); setActiveTab('orders'); }}
          className={`text-left p-4 rounded-2xl border transition-all ${statusFilter === 'All' && activeTab === 'orders' ? 'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
          <div className="flex items-center gap-2">
            <Package size={14} className="text-indigo-500" />
            <p className="text-lg font-bold text-slate-800">{stats.totalOrders}</p>
          </div>
        </button>
        <button 
          onClick={() => { setStatusFilter('Pending'); setActiveTab('orders'); }}
          className={`text-left p-4 rounded-2xl border transition-all ${statusFilter === 'Pending' && activeTab === 'orders' ? 'border-amber-600 bg-amber-50 shadow-md scale-[1.02]' : 'bg-white border-slate-200 hover:border-amber-200'}`}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Queue</p>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-500" />
            <p className="text-lg font-bold text-slate-800">{stats.pendingOrders}</p>
          </div>
        </button>
        <div className="bg-slate-900 p-4 rounded-2xl shadow-lg text-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
          <p className="text-lg font-bold tracking-tight">₵{stats.totalSales.toFixed(2)}</p>
        </div>
        <button 
           onClick={() => setActiveTab('staff')}
           className={`text-left p-4 rounded-2xl border transition-all ${activeTab === 'staff' ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Staff / Admins</p>
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-indigo-500" />
            <p className="text-lg font-bold text-slate-800">{stats.totalStaff}</p>
          </div>
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        {(['orders', 'clients', 'plans', 'staff'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all capitalize ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        {/* Header section */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">
            {activeTab === 'orders' ? `Orders (${statusFilter})` : activeTab === 'clients' ? 'User Management' : activeTab === 'plans' ? 'Plans Management' : 'Admin Management'}
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {activeTab === 'plans' && (
              <button 
                onClick={() => setShowPlanForm(!showPlanForm)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Bundle
              </button>
            )}
            {activeTab === 'staff' && (
              <button 
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Plus size={14} /> New Admin
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 w-full sm:w-64 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Forms */}
        {showAdminForm && activeTab === 'staff' && (
          <div className="p-6 bg-indigo-50 border-b border-indigo-100">
             <h3 className="text-sm font-bold text-indigo-900 mb-4">Create New Administrator</h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <input type="text" placeholder="Name" className="bg-white border p-3 rounded-xl text-xs outline-none" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
               <input type="email" placeholder="Email" className="bg-white border p-3 rounded-xl text-xs outline-none" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
               <input type="password" placeholder="Password" className="bg-white border p-3 rounded-xl text-xs outline-none" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
               <button 
                onClick={() => { onAddAdmin(newAdmin.email, newAdmin.name, newAdmin.password); setShowAdminForm(false); setNewAdmin({email:'', name:'', password:''}); }}
                className="bg-indigo-600 text-white rounded-xl text-xs font-bold"
               >Create Admin</button>
             </div>
          </div>
        )}

        {showPlanForm && activeTab === 'plans' && (
           <div className="p-6 bg-indigo-50 border-b border-indigo-100">
             <h3 className="text-sm font-bold text-indigo-900 mb-4">Add Bundle Plan</h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select value={newPlan.network} onChange={e => setNewPlan({...newPlan, network: e.target.value as any})} className="bg-white border p-3 rounded-xl text-xs outline-none">
                  <option>MTN</option>
                  <option>Telecel</option>
                  <option>AT</option>
                </select>
                <input type="text" placeholder="Size (e.g. 10GB)" className="bg-white border p-3 rounded-xl text-xs outline-none" value={newPlan.size} onChange={e => setNewPlan({...newPlan, size: e.target.value})} />
                <input type="number" placeholder="Price (GHS)" className="bg-white border p-3 rounded-xl text-xs outline-none" value={newPlan.price || ''} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} />
                <button onClick={() => { onAddPlan(newPlan); setShowPlanForm(false); }} className="bg-indigo-600 text-white rounded-xl text-xs font-bold">Save Plan</button>
             </div>
           </div>
        )}

        {activeTab === 'plans' && (
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex gap-2">
            {(['MTN', 'Telecel', 'AT'] as const).map(net => (
              <button key={net} onClick={() => setActiveNetwork(net)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all ${activeNetwork === net ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500'}`}>{net}</button>
            ))}
          </div>
        )}

        <div className="divide-y divide-slate-50">
          {activeTab === 'orders' ? (
            filteredOrders.map(tx => (
              <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white ${tx.plan.includes('MTN') ? 'bg-amber-400' : 'bg-blue-500'}`}>{tx.plan.charAt(0)}</div>
                   <div>
                      <p className="font-bold text-slate-800 text-sm">{tx.recipient}</p>
                      <p className="text-[11px] text-slate-500">{tx.plan} • {tx.date} • <span className="text-indigo-600 font-bold font-mono">₵{tx.amount.toFixed(2)}</span></p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${tx.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{tx.status}</span>
                   {tx.status === 'Pending' && (
                     <div className="flex gap-1">
                        <button onClick={() => onUpdateStatus(tx.id, 'Success')} className="p-2 text-green-600 hover:bg-green-50 rounded-xl"><CheckCircle2 size={18}/></button>
                        <button onClick={() => onUpdateStatus(tx.id, 'Failed')} className="p-2 text-red-600 hover:bg-red-50 rounded-xl"><XCircle size={18}/></button>
                     </div>
                   )}
                </div>
              </div>
            ))
          ) : activeTab === 'clients' ? (
            filteredClients.map(client => (
              <div key={client.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold">{client.name.charAt(0)}</div>
                   <div>
                      <p className="font-bold text-slate-800 text-sm">{client.name}</p>
                      <p className="text-[11px] text-indigo-600 font-medium">{client.phone}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Passcode</p>
                      <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg">
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {visiblePasswords[client.id] ? client.password : '••••••••'}
                        </span>
                        <button onClick={() => togglePassword(client.id)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                          {visiblePasswords[client.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                        </button>
                      </div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => handleResetPassword(client.id)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Reset Password">
                        <Key size={18}/>
                     </button>
                     <button onClick={() => onDeleteClient(client.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Remove User">
                        <Trash2 size={18}/>
                     </button>
                   </div>
                </div>
              </div>
            ))
          ) : activeTab === 'staff' ? (
            filteredStaff.map(staff => (
              <div key={staff.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><ShieldAlert size={20}/></div>
                   <div>
                      <p className="font-bold text-slate-800 text-sm">{staff.name}</p>
                      <p className="text-[11px] text-indigo-600 font-medium">{staff.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   {staff.email !== 'themediaplace7@gmail.com' && (
                      <button onClick={() => onDeleteClient(staff.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={20}/>
                      </button>
                   )}
                </div>
              </div>
            ))
          ) : (
            plans.filter(p => p.network === activeNetwork).map(plan => (
              <div key={plan.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Signal size={18}/></div>
                   <div>
                      <p className="font-bold text-slate-800 text-sm">{plan.size}</p>
                      <p className="text-[11px] text-slate-500">₵{plan.price.toFixed(2)}</p>
                   </div>
                </div>
                <button onClick={() => onDeletePlan(plan.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={20}/>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
