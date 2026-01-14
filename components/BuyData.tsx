import React, { useState } from 'react';
import { Wifi, AlertCircle, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { DataPlan } from '../types';

interface BuyDataProps {
  onPurchase: (plan: DataPlan, phone: string) => void;
  plans: DataPlan[];
}

const BuyData: React.FC<BuyDataProps> = ({ onPurchase, plans }) => {
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState<DataPlan['network']>('MTN');
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const networks: { id: DataPlan['network']; label: string; color: string; bg: string; border: string }[] = [
    { id: 'MTN', label: 'MTN', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'Telecel', label: 'Telecel', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { id: 'AT', label: 'AT (AirtelTigo)', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' }
  ];

  const filteredPlans = plans.filter(p => p.network === network);

  const handlePayment = () => {
    if (!selectedPlan || phone.length < 9) return;
    
    setIsProcessing(true);
    // Simulate payment gateway redirection and processing
    setTimeout(() => {
      onPurchase(selectedPlan, phone);
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
      <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium text-slate-800 flex items-center gap-2">
            <Wifi className="text-indigo-600" size={20} /> Data Portal
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium bg-slate-50 px-3 py-1.5 rounded-full">
            <ShieldCheck size={12} className="text-green-500" /> Secure Checkout
          </div>
        </div>

        <div className="space-y-8">
          {/* Network Selection Section */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 mb-4">Select Network Provider</label>
            <div className="grid grid-cols-3 gap-3">
              {networks.map(n => (
                <button
                  key={n.id}
                  disabled={isProcessing}
                  onClick={() => {
                    setNetwork(n.id);
                    setSelectedPlan(null);
                  }}
                  className={`
                    relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group
                    ${network === n.id 
                      ? `${n.border} ${n.bg} shadow-md shadow-indigo-50` 
                      : 'border-slate-50 hover:border-slate-100 hover:bg-slate-50/50'}
                  `}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${network === n.id ? n.color : 'text-slate-300'}`}>
                    {n.label.charAt(0)}
                  </div>
                  <span className={`text-[11px] font-medium ${network === n.id ? 'text-slate-800' : 'text-slate-400'}`}>
                    {n.label}
                  </span>
                  {network === n.id && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-medium text-slate-400 ml-1">Recipient Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs font-mono">+233</div>
                <input
                  type="tel"
                  disabled={isProcessing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="000 000 000"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-medium text-slate-400 ml-1">Bundle Service</label>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-medium text-slate-600">
                {network} Data Gifting
              </div>
            </div>
          </div>

          {/* Plan Listing Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-[10px] font-medium text-slate-400">Available Packages</label>
              <span className="text-[10px] text-indigo-500 font-medium">{filteredPlans.length} plans</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
              {filteredPlans.map(plan => (
                <button
                  key={plan.id}
                  disabled={isProcessing}
                  onClick={() => setSelectedPlan(plan)}
                  className={`
                    relative p-3.5 rounded-2xl border transition-all text-left group
                    ${selectedPlan?.id === plan.id 
                      ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' 
                      : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex flex-col gap-0.5">
                    <p className={`font-medium text-[13px] ${selectedPlan?.id === plan.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {plan.size}
                    </p>
                    <p className="text-[9px] text-slate-400">No Expiry</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-600">₵{plan.price.toFixed(2)}</span>
                    {selectedPlan?.id === plan.id && <Zap size={10} className="text-indigo-600 fill-indigo-600" />}
                  </div>
                </button>
              ))}
              {filteredPlans.length === 0 && (
                <div className="col-span-full py-10 text-center text-[11px] text-slate-400 italic">
                  No active packages for {network} currently.
                </div>
              )}
            </div>
          </div>

          <button
            disabled={!selectedPlan || phone.length < 9 || isProcessing}
            onClick={handlePayment}
            className="w-full bg-indigo-600 text-white font-normal py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center justify-center gap-2 text-[13px]"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              "Pay"
            )}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 text-slate-400">
        <AlertCircle className="shrink-0 w-5 h-5 text-indigo-400" />
        <div className="space-y-1">
          <p className="text-[11px] leading-relaxed font-medium text-slate-200">Gateway Direct Payment</p>
          <p className="text-[10px] leading-relaxed font-normal opacity-80">
            You will be charged GH₵{selectedPlan?.price.toFixed(2) || '0.00'} immediately. Data activation starts as soon as payment is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyData;