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
  ShieldAlert,
  Edit2,
  Check,
  X,
  Lock,
  Filter
} from 'lucide-react';

interface AdminProps {
  transactions: Transaction[];
  clients: User[];
  plans: DataPlan[];
  currentUser: User;
  onUpdateStatus: (id: string, status: Transaction['status']) => void;
  onDeleteClient: (id: string) => void;
  onUpdateUserPassword: (id: string, newPass: string) => void;
  onAddPlan: (plan: Omit<DataPlan, 'id'>) => void;
  onUpdatePlan: (plan: DataPlan) => void;
  onDeletePlan: (id: string) => void;
  onAddAdmin: (email: string, name: string, pass: string) => void;
}

const Admin: React.FC<AdminProps> = ({ 
  transactions, 
  clients, 
  plans, 
  currentUser,
  onUpdateStatus, 
  onDeleteClient, 
  onUpdateUserPassword,
  onAddPlan, 
  onUpdatePlan,
  onDeletePlan,
  onAddAdmin
}) => {
  const isMainAdmin = currentUser.email === 'themediaplace7@gmail.com';
  
  const [activeTab, setActiveTab] = useState<'orders' | 'clients' | 'plans' | 'staff'>('orders');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'All'>('All');
  const [activeNetwork, setActiveNetwork] = useState<DataPlan['network']>('MTN');
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: '', name: '', password: '' });
  const [newPlan, setNewPlan] = useState<Omit<DataPlan, 'id'>>({ network: 'MTN', size: '', price: 0 });
  
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPlanData, setEditPlanData] = useState<DataPlan | null>(null);

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

  const startEditing = (plan: DataPlan) => {
    setEditingPlanId(plan.id);
    setEditPlanData({ ...plan });
  };

  const cancelEditing = () => {
    setEditingPlanId(null);
    setEditPlanData(null);
  };

  const savePlanUpdate = () => {
    if (editPlanData) {
      onUpdatePlan(editPlanData);
      setEditingPlanId(null);
      setEditPlanData(null);
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

  const networks: DataPlan['network'][] = ['MTN', 'Telecel', 'AT'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => { setStatusFilter('All'); setActiveTab('orders'); }}
          className={`text-left p-6 rounded-[2rem] border transition-all ${statusFilter === 'All' && activeTab === 'orders' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}
        >
          <p className="text-[10px] font-medium text-slate-400 mb-1">Total Queue</p>
          <div className="flex items-center gap-2">
            <Package size={14} className="text-indigo-500" />
            <p className="text-xl font-medium text-slate-800">{stats.totalOrders}</p>
          </div>
        </button>
        <button 
          onClick={() => { setStatusFilter('Pending'); setActiveTab('orders'); }}
          className={`text-left p-6 rounded-[2rem] border transition-all ${statusFilter === 'Pending' && activeTab === 'orders' ? 'border-amber-600 bg-amber-50 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}
        >
          <p className="text-[10px] font-medium text-slate-400 mb-1">Awaiting Action</p>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-500" />
            <p className="text-xl font-medium text-slate-800">{stats.pendingOrders}</p>
          </div>
        </button>
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-100">
          <p className="text-[10px] font-medium text-slate-400 mb-1">Total Turnover</p>
          <p className="text-xl font-medium tracking-tight">₵{stats.totalSales.toFixed(2)}</p>
        </div>
        <button 
           onClick={() => setActiveTab('staff')}
           className={`text-left p-6 rounded-[2rem] border transition-all ${activeTab === 'staff' ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'bg-white border-slate-100 shadow-sm'}`}
        >
          <p className="text-[10px] font-medium text-slate-400 mb-1">Active Admins</p>
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-indigo-500" />
            <p className="text-xl font-medium text-slate-800">{stats.totalStaff}</p>
          </div>
        </button>
      </div>

      {/* Main Tab Bar - Forced to one line */}
      <div className="flex flex-nowrap overflow-x-auto gap-2 p-1.5 bg-slate-100 rounded-2xl w-full sm:w-fit no-scrollbar">
        {(['orders', 'clients', 'plans', 'staff'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-medium transition-all whitespace-nowrap capitalize ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-medium text-slate-800 capitalize">{activeTab} Console</h2>
            <p className="text-[10px] text-slate-400 font-normal mt-0.5">Manage and monitor {activeTab} activity</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {activeTab === 'plans' && (
              <button 
                onClick={() => setShowPlanForm(!showPlanForm)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                <Plus size={14} /> New Package
              </button>
            )}
            
            {activeTab === 'staff' && isMainAdmin && (
              <button 
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
              >
                <Plus size={14} /> Add Admin
              </button>
            )}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input 
                type="text" 
                placeholder="Live filter..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 w-full sm:w-56 text-[11px] font-normal"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Section Tabs for Plans & Status Filters for Orders */}
        {activeTab === 'plans' && (
          <div className="px-8 pt-6">
            <div className="flex gap-4 border-b border-slate-100">
              {networks.map(n => (
                <button
                  key={n}
                  onClick={() => setActiveNetwork(n)}
                  className={`pb-4 text-[11px] font-medium transition-all relative capitalize
                    ${activeNetwork === n ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
                  `}
                >
                  {n}
                  {activeNetwork === n && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="px-8 py-4 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
            <div className="flex flex-nowrap overflow-x-auto gap-1.5 no-scrollbar">
              {(['All', 'Pending', 'Success', 'Failed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap border ${
                    statusFilter === status
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Forms */}
        {showAdminForm && activeTab === 'staff' && (
          <div className="m-8 p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
               <input type="text" placeholder="Full Name" className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] outline-none" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
               <input type="email" placeholder="Work Email" className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] outline-none" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
               <input type="password" placeholder="Passcode" className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] outline-none" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
               <button 
                onClick={() => { onAddAdmin(newAdmin.email, newAdmin.name, newAdmin.password); setShowAdminForm(false); setNewAdmin({email:'', name:'', password:''}); }}
                className="bg-indigo-600 text-white rounded-xl text-[11px] font-medium shadow-md shadow-indigo-100"
               >Grant Access</button>
             </div>
          </div>
        )}

        {showPlanForm && activeTab === 'plans' && (
           <div className="m-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select value={newPlan.network} onChange={e => setNewPlan({...newPlan, network: e.target.value as any})} className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] outline-none">
                  {networks.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <input type="text" placeholder="Capacity (e.g. 5GB)" className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] outline-none" value={newPlan.size} onChange={e => setNewPlan({...newPlan, size: e.target.value})} />
                <input type="number" placeholder="Cost (₵)" className="bg-white border border-slate-100 p-3 rounded-xl text-[11px] outline-none" value={newPlan.price || ''} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} />
                <button onClick={() => { onAddPlan(newPlan); setShowPlanForm(false); }} className="bg-slate-900 text-white rounded-xl text-[11px] px-4 font-medium h-10 col-span-1 md:col-span-3 mt-2">Publish Plan</button>
             </div>
           </div>
        )}

        {/* List Content */}
        <div className="divide-y divide-slate-50">
          {activeTab === 'orders' ? (
            filteredOrders.length > 0 ? (
              filteredOrders.map(tx => (
                <div key={tx.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold text-white shadow-sm ${tx.plan.includes('MTN') ? 'bg-amber-400' : tx.plan.includes('Telecel') ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {tx.plan.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-[13px]">{tx.recipient}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{tx.plan} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-700">₵{tx.amount.toFixed(2)}</p>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full capitalize ${tx.status === 'Success' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>{tx.status}</span>
                    </div>
                    {tx.status === 'Pending' && (
                      <div className="flex gap-1.5 border-l border-slate-100 pl-6">
                        <button onClick={() => onUpdateStatus(tx.id, 'Success')} className="p-2.5 text-green-500 hover:bg-green-50 rounded-xl transition-colors"><CheckCircle2 size={18}/></button>
                        <button onClick={() => onUpdateStatus(tx.id, 'Failed')} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-colors"><XCircle size={18}/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-[11px] text-slate-300">No {statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} orders matching your criteria</div>
            )
          ) : activeTab === 'clients' ? (
            filteredClients.map(client => (
              <div key={client.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[13px] font-bold text-slate-400 border border-slate-50 shadow-inner">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-[13px]">{client.name}</p>
                    <p className="text-[10px] text-indigo-500 font-normal">{client.phone || 'No phone'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <span className="text-[11px] font-mono text-slate-500">
                      {visiblePasswords[client.id] ? client.password : '••••••••'}
                    </span>
                    <button onClick={() => togglePassword(client.id)} className="text-slate-300 hover:text-indigo-500 transition-colors">
                      {visiblePasswords[client.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleResetPassword(client.id)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Key size={16}/></button>
                    <button onClick={() => onDeleteClient(client.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            ))
          ) : activeTab === 'staff' ? (
            filteredStaff.map(staff => (
              <div key={staff.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                    <ShieldAlert size={18}/>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-[13px]">{staff.name}</p>
                    <p className="text-[10px] text-indigo-500 font-normal">{staff.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {(isMainAdmin || staff.id === currentUser.id) && (
                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-mono text-slate-500">
                        {visiblePasswords[staff.id] ? staff.password : '••••••••'}
                      </span>
                      <button onClick={() => togglePassword(staff.id)} className="text-slate-300 hover:text-indigo-500 transition-colors">
                        {visiblePasswords[staff.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                      </button>
                    </div>
                  )}

                  {isMainAdmin && staff.email !== 'themediaplace7@gmail.com' && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleResetPassword(staff.id)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Lock size={16}/></button>
                      <button onClick={() => onDeleteClient(staff.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            plans.filter(p => p.network === activeNetwork).length > 0 ? (
              plans.filter(p => p.network === activeNetwork).map(plan => (
                <div key={plan.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  {editingPlanId === plan.id && editPlanData ? (
                    <div className="flex-1 flex flex-col gap-4 bg-slate-50 p-4 rounded-2xl border border-indigo-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 ml-1">Capacity</label>
                          <input 
                            type="text" 
                            value={editPlanData.size} 
                            onChange={e => setEditPlanData({...editPlanData, size: e.target.value})}
                            className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-[11px] outline-none focus:border-indigo-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 ml-1">Price (₵)</label>
                          <input 
                            type="number" 
                            value={editPlanData.price} 
                            onChange={e => setEditPlanData({...editPlanData, price: Number(e.target.value)})}
                            className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-[11px] outline-none focus:border-indigo-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={savePlanUpdate} className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-1.5 rounded-lg text-[11px] font-medium"><Check size={14}/> Save</button>
                        <button onClick={cancelEditing} className="flex items-center gap-1.5 bg-slate-200 text-slate-600 px-4 py-1.5 rounded-lg text-[11px] font-medium"><X size={14}/> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                          <Signal size={18}/>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-[13px]">{plan.size}</p>
                          <p className="text-[10px] text-slate-400 font-normal">₵{plan.price.toFixed(2)} • No Expiry</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEditing(plan)} className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <Edit2 size={16}/>
                        </button>
                        <button onClick={() => onDeletePlan(plan.id)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-[11px] text-slate-300">No plans defined for {activeNetwork}</div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;