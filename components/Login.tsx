
import React, { useState } from 'react';
import { Zap, Lock, Phone, ArrowRight, User as UserIcon, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (identifier: string, password: string, role: 'user' | 'admin', name?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminSignup, setIsAdminSignup] = useState(false);
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      // Determine role based on signup type or identifier detection
      let role: 'user' | 'admin' = 'user';
      
      if (isAdminSignup || identifier.includes('@')) {
        role = 'admin';
      }

      onLogin(identifier, password, role, name);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-200">
              <Zap className="text-white w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
              {isLogin ? 'Welcome Back' : isAdminSignup ? 'Admin Sign Up' : 'Create Account'}
            </h1>
            <p className="text-slate-500 text-sm">
              {isLogin ? 'Manage your data bundles instantly' : 'Join Ghana\'s fastest data reselling platform'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                {isAdminSignup || identifier.includes('@') ? 'Email Address' : 'Phone Number'}
              </label>
              <div className="relative">
                {isAdminSignup || identifier.includes('@') ? (
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                ) : (
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                )}
                <input
                  required
                  type={isAdminSignup || identifier.includes('@') ? 'email' : 'tel'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={isAdminSignup || identifier.includes('@') ? 'admin@example.com' : '024XXXXXXX'}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group mt-4 active:scale-95"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Get Started'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setIsAdminSignup(false);
              }}
              className="text-indigo-600 text-sm font-bold hover:underline block w-full"
            >
              {isLogin ? 'New to DataSwift? Create an account' : 'Already have an account? Sign in'}
            </button>
            {!isLogin && (
              <button 
                onClick={() => setIsAdminSignup(!isAdminSignup)}
                className="text-slate-400 text-xs font-bold hover:text-indigo-600"
              >
                {isAdminSignup ? 'Switch to User Signup' : 'Switch to Admin Signup'}
              </button>
            )}
            {isLogin && (
               <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Main Admin access: <span className="text-slate-600 select-all">themediaplace7@gmail.com</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
