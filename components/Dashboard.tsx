import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Wifi, 
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Transaction, ViewType } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  setView: (view: ViewType) => void;
  userRole?: 'user' | 'admin';
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, setView, userRole }) => {
  const totalAmount = transactions
    .filter(t => t.status === 'Success')
    .reduce((a, c) => a + c.amount, 0);

  // Generate chart data based on recent transactions or zero if none
  const chartData = [
    { name: 'M', spent: 0 },
    { name: 'T', spent: 0 },
    { name: 'W', spent: 0 },
    { name: 'T', spent: 0 },
    { name: 'F', spent: 0 },
    { name: 'S', spent: 0 },
    { name: 'S', spent: 0 },
  ];

  return (
    <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <div className="bg-slate-900 p-3 md:p-6 rounded-2xl text-white shadow-lg transition-transform hover:scale-[1.01]">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-indigo-600 p-1 rounded-lg">
              <TrendingUp size={14} className="md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-slate-400 text-[9px] md:text-xs font-medium">
            {userRole === 'admin' ? 'Total Revenue' : 'Total Spend'}
          </p>
          <h2 className="text-base md:text-2xl font-medium tracking-tight">
            GH₵{totalAmount.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-slate-200 transition-transform hover:scale-[1.01]">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-indigo-50 p-1 rounded-lg text-indigo-600">
              <Wifi size={14} className="md:w-5 md:h-5" />
            </div>
          </div>
          <p className="text-slate-500 text-[9px] md:text-xs font-medium">Transactions</p>
          <h2 className="text-base md:text-2xl font-medium text-slate-800 tracking-tight">
            {transactions.length} Records
          </h2>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${userRole === 'admin' ? 'lg:grid-cols-3' : ''} gap-4 md:gap-8`}>
        {userRole === 'admin' && (
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs md:text-sm font-medium text-slate-800">Platform Activity</h3>
            </div>
            <div className="h-[160px] md:h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value) => [`GH₵${value}`, 'Amount']}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spent" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorSpent)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className={`${userRole === 'admin' ? '' : 'lg:col-span-3'} bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col`}>
          <h3 className="text-xs md:text-sm font-medium text-slate-800 mb-4">Quick Actions</h3>
          
          <button 
            onClick={() => setView(userRole === 'admin' ? 'admin' : 'buy-data')}
            className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                {userRole === 'admin' ? <ShieldCheck size={18} /> : <Zap size={18} />}
              </div>
              <div className="text-left">
                <span className="text-sm font-medium">{userRole === 'admin' ? 'System Console' : 'Order Data Bundle'}</span>
              </div>
            </div>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] font-medium text-slate-400">Recent Records</h4>
              <button onClick={() => setView('history')} className="text-[10px] text-indigo-600 font-medium hover:underline">View All</button>
            </div>
            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <Wifi size={12} />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-800 line-clamp-1">{tx.recipient}</p>
                      <p className="text-[9px] text-slate-400">{tx.date}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">₵{tx.amount.toFixed(2)}</span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center py-4 text-[10px] text-slate-300 italic">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;