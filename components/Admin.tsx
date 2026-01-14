import React, { useState } from 'react';
import { Transaction, User, DataPlan } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Clock, 
  Package,
  Trash2,
  Plus,
  Signal,
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

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', name: '', password: '' });
  const [newPlan, setNewPlan] = useState<Omit<DataPlan, 'id'>>({ network: 'MTN', size: '', price: 0, validity: '30 Days' });

  const stats = {
    totalSales: transactions.filter(t => t.status === 'Success').reduce((acc, curr) => acc + curr.amount, 0),
    pendingOrders: transactions.filter(t => t.status === 'Pending').length,
    totalOrders: transactions.length,
    totalStaff: clients.filter(c => c.role === 'admin').length
  };

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetPassword = (id: string) => {
    const newPass = prompt("Enter new password (min 6 chars):");
    if (newPass && newPass.length >= 6) {
      onUpdateUserPassword(id, newPass);
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => { setStatusFilter('All'); setActiveTab('orders'); }}
          className={`text-left p-5 rounded-2xl border transition-all ${statusFilter === 'All' && activeTab === 'orders' ? 'border-indigo-600 bg-indigo-50' : 'bg-white border-slate-200'}`}
        >
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
          <div className="flex items-center gap-2">
            <Package size={14} className="text-indigo-500" />
            <p className="text-lg font-medium text-slate-800">{stats.totalOrders}</p>
          </div>
        </button>
        <button 
          onClick={() => { setStatusFilter('Pending'); setActiveTab('orders'); }}
          className={`text-left p-5 rounded-2xl border transition-all ${statusFilter === 'Pending' && activeTab === 'orders' ? 'border-amber-600 bg-amber-50' : 'bg-white border-slate-200'}`}
        >
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Pending Queue</p>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-500" />
            <p className="text-lg font-medium text-slate-800">{stats.pendingOrders}</p>
          </div>
        </button>
        <div className="bg-slate-900 p-5 rounded-2xl text-white">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Revenue</p>
          <p className="text-lg font-medium tracking-tight">₵{stats.totalSales.toFixed(2)}</p>
        </div>
        <button 
           onClick={() => setActiveTab('staff')}
           className={`text-left p-5 rounded-2xl border transition-all ${activeTab === 'staff' ? 'border-indigo-600 bg-indigo-50' : 'bg-white border-slate-200'}`}
        >
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Admin Staff</p>
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-indigo-500" />
            <p className="text-lg font-medium text-slate-800">{stats.totalStaff}</p>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        {(['orders', 'clients', 'plans', 'staff'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-xs font-medium transition-all capitalize ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-base font-medium text-slate-800 capitalize">{activeTab}</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {activeTab === 'plans' && (
              <button 
                onClick={() => setShowPlanForm(!showPlanForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Plan
              </button>
            )}
            {activeTab === 'staff' && (
              <button 
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Admin
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input 
                type="text" 
                placeholder="Quick search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 w-full sm:w-48 text-[11px] font-normal"
              />
            </div>
          </div>
        </div>

        {showAdminForm && activeTab === 'staff' && (
          <div className="p-6 bg-indigo-50/50 border-b border-indigo-50">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
               <input type="text" placeholder="Admin Name" className="bg-white border border-slate-100 p-2.5 rounded-xl text-[11px] outline-none" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
               <input type="email" placeholder="Admin Email" className="bg-white border border-slate-100 p-2.5 rounded-xl text-[11px] outline-none" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
               <input type="password" placeholder="Password" className="bg-white border border-slate-100 p-2.5 rounded-xl text-[11px] outline-none" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
               <button 
                onClick={() => { onAddAdmin(newAdmin.email, newAdmin.name, newAdmin.password); setShowAdminForm(false); setNewAdmin({email:'', name:'', password:''}); }}
                className="bg-indigo-600 text-white rounded-xl text-[11px] font-medium"
               >Confirm Admin</button>
             </div>
          </div>
        )}

        {showPlanForm && activeTab === 'plans' && (
           <div className="p-6 bg-indigo-50/50 border-b border-indigo-50">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <select value={newPlan.network} onChange={e => setNewPlan({...newPlan, network: e.target.value as any})} className="bg-white border border-slate-100 p-2.5 rounded-xl text-[11px] outline-none">
                  <option>MTN</option>
                  <option>Telecel</option>
                  <option>AT</option>
                </select>
                <input type="text" placeholder="Size (e.g. 5GB)" className="bg-white border border-slate-100 p-2.5 rounded-xl text-[11px] outline-none" value={newPlan.size} onChange={e => setNewPlan({...newPlan, size: e.target.value})} />
                <input type="number" placeholder="Price (₵)" className="bg-white border border-slate-100 p-2.5 rounded-xl text-[11px] outline-none" value={newPlan.price || ''} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} />
                <button onClick={() => { onAddPlan(newPlan); setShowPlanForm(false); }} className="bg-indigo-600 text-white rounded-xl text-[11px] font-medium">Add Plan</button>
             </div>
           </div>
        )}

        <div className="divide-y divide-slate-50">
          {activeTab === 'orders' ? (
            filteredOrders.map(tx => (
              <div key={tx.id} className="p-5 flex items-center justify-between hover:bg-slate-50/30">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-medium text-white ${tx.plan.includes('MTN') ? 'bg-amber-400' : 'bg-indigo-500'}`}>{tx.plan.charAt(0)}</div>
                   <div>
                      <p className="font-medium text-slate-800 text-[13px]">{tx.recipient}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{tx.plan} • {tx.date}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className={`px-3 py-1 rounded-full text-[9px] font-medium uppercase tracking-widest ${tx.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{tx.status}</span>
                   {tx.status === 'Pending' && (
                     <div className="flex gap-1">
                        <button onClick={() => onUpdateStatus(tx.id, 'Success')} className="p-2 text-green-500 hover:bg-green-50 rounded-xl"><CheckCircle2 size={16}/></button>
                        <button onClick={() => onUpdateStatus(tx.id, 'Failed')} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><XCircle size={16}/></button>
                     </div>
                   )}
                </div>
              </div>
            ))
          ) : activeTab === 'clients' ? (
            filteredClients.map(client => (
              <div key={client.id} className="p-5 flex items-center justify-between hover:bg-slate-50/30">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium">{client.name.charAt(0)}</div>
                   <div>
                      <p className="font-medium text-slate-800 text-[13px]">{client.name}</p>
                      <p className="text-[10px] text-indigo-500 font-normal">{client.phone}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-mono text-slate-500">
                        {visiblePasswords[client.id] ? client.password : '••••••••'}
                      </span>
                      <button onClick={() => togglePassword(client.id)} className="text-slate-300 hover:text-indigo-500">
                        {visiblePasswords[client.id] ? <EyeOff size={12}/> : <Eye size={12}/>}
                      </button>
                   </div>
                   <button onClick={() => handleResetPassword(client.id)} className="p-2 text-slate-400 hover:text-indigo-600"><Key size={16}/></button>
                   <button onClick={() => onDeleteClient(client.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>
            ))
          ) : activeTab === 'staff' ? (
            filteredStaff.map(staff => (
              <div key={staff.id} className="p-5 flex items-center justify-between hover:bg-slate-50/30">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500"><ShieldAlert size={16}/></div>
                   <div>
                      <p className="font-medium text-slate-800 text-[13px]">{staff.name}</p>
                      <p className="text-[10px] text-indigo-500 font-normal">{staff.email}</p>
                   </div>
                </div>
                {staff.email !== 'admin@dataswift.com' && (
                  <button onClick={() => onDeleteClient(staff.id)} className="p-2 text-slate-400 hover:text-red-500">
                    <Trash2 size={16}/>
                  </button>
                )}
              </div>
            ))
          ) : (
            plans.filter(p => p.network === activeNetwork).map(plan => (
              <div key={plan.id} className="p-5 flex items-center justify-between hover:bg-slate-50/30">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"><Signal size={16}/></div>
                   <div>
                      <p className="font-medium text-slate-800 text-[13px]">{plan.size}</p>
                      <p className="text-[10px] text-slate-400 font-normal">₵{plan.price.toFixed(2)}</p>
                   </div>
                </div>
                <button onClick={() => onDeletePlan(plan.id)} className="p-2 text-slate-400 hover:text-red-500">
                  <Trash2 size={16}/>
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