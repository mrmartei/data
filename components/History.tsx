import React from 'react';
import { Transaction } from '../types';
import { Search } from 'lucide-react';

interface HistoryProps {
  transactions: Transaction[];
}

const History: React.FC<HistoryProps> = ({ transactions }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-bold text-slate-800">History</h2>
          <div className="relative input-container">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-14 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 w-32 md:w-48 text-[11px] md:text-xs"
            />
          </div>
        </div>

        {/* List for both mobile and desktop - sleek design */}
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-8 rounded-full ${tx.status === 'Success' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div>
                  <p className="text-[12px] md:text-sm font-bold text-slate-800 tracking-tight">
                    {tx.recipient}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {tx.plan} • {tx.date}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[12px] md:text-sm font-bold text-slate-800">
                  GH₵{tx.amount.toFixed(2)}
                </p>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${
                  tx.status === 'Success' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-[11px]">
              No transactions found yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;