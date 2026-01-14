import React, { useState } from 'react';
import { Zap, Lock, Phone, ArrowRight, User as UserIcon, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (identifier: string, password: string, role: 'user' | 'admin', name?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      onLogin(identifier, password, 'user', isLogin ? undefined : name);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-[2rem] shadow-xl shadow-indigo-100/20 border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
              <Zap className="text-white w-5 h-5" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-lg font-medium text-slate-800 mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-slate-400 text-[11px] font-normal">
              {isLogin ? 'Sign in to access your services' : 'Join our fast data network'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">Full name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all text-[11px] font-normal"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                {identifier.includes('@') ? 'Email address' : 'Phone number'}
              </label>
              <div className="relative">
                {identifier.includes('@') ? (
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                ) : (
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                )}
                <input
                  required
                  type={identifier.includes('@') ? 'email' : 'tel'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={identifier.includes('@') ? 'Enter email' : 'Enter phone number'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all text-[11px] font-normal"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all text-[11px] font-normal"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all text-[11px] font-normal"
                  />
                </div>
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-normal py-3 rounded-xl shadow-lg shadow-indigo-50 transition-all flex items-center justify-center gap-2 group mt-5 active:scale-[0.98] text-xs"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-indigo-500 text-[11px] font-normal hover:text-indigo-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;