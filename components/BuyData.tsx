
import React, { useState } from 'react';
import { Wifi, AlertCircle, Zap } from 'lucide-react';
import { DataPlan } from '../types';

interface BuyDataProps {
  onPurchase: (plan: DataPlan, phone: string) => void;
  plans: DataPlan[];
}

const BuyData: React.FC<BuyDataProps> = ({ onPurchase, plans }) => {
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState<DataPlan['network']>('MTN');
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);

  const networks: DataPlan['network'][] = ['MTN', 'Telecel', 'AT'];
  const filteredPlans = plans.filter(p => p.network === network);

  return (
    <div className="max-w-xl mx-auto space-y-4 md:space-y-6">
      <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Wifi className="text-indigo-600" size={20} /> Buy Data Bundle
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Network</label>
            <div className="grid grid-cols-3 gap-2">
              {networks.map(n => (
                <button
                  key={n}
                  onClick={() => {
                    setNetwork(n);
                    setSelectedPlan(null);
                  }}
                  className={`
                    py-2 rounded-xl border-2 font-bold text-[11px] md:text-xs transition-all
                    ${network === n 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                      : 'border-slate-50 text-slate-400 hover:border-slate-100'}
                  `}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recipient Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0244123456"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Plan</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {filteredPlans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-xl border transition-all
                    ${selectedPlan?.id === plan.id 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-slate-50 hover:border-slate-100'}
                  `}
                >
                  <div className="text-left">
                    <p className="font-bold text-xs md:text-sm text-slate-800">{plan.size}</p>
                    <p className="text-[9px] text-slate-400">{plan.validity}</p>
                  </div>
                  <span className="text-indigo-600 font-bold text-xs md:text-sm">GH₵{plan.price}</span>
                </button>
              ))}
              {filteredPlans.length === 0 && (
                <p className="text-center py-4 text-xs text-slate-400 italic">No plans currently available for {network}.</p>
              )}
            </div>
          </div>

          <button
            disabled={!selectedPlan || phone.length < 10}
            onClick={() => selectedPlan && onPurchase(selectedPlan, phone)}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-200 disabled:shadow-none transition-all mt-2 text-xs md:text-sm flex items-center justify-center gap-2"
          >
            <Zap size={14} /> Place Bundle Order
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3 text-amber-800">
        <AlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
        <p className="text-[10px] leading-relaxed font-medium">
          Note: Your order will be processed manually. Once you place an order, please send the payment to our designated MoMo number. An admin will verify and activate your bundle shortly.
        </p>
      </div>
    </div>
  );
};

export default BuyData;