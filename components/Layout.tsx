import React from 'react';
import { 
  Wifi, 
  History, 
  Settings, 
  LogOut, 
  Menu,
  Zap,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  userRole?: 'user' | 'admin';
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
  ];

  if (userRole === 'user') {
    navItems.push({ id: 'buy-data' as ViewType, label: 'Buy Data', icon: Wifi });
  }

  navItems.push({ id: 'history' as ViewType, label: 'History', icon: History });

  if (userRole === 'admin') {
    navItems.push({ id: 'admin' as ViewType, label: 'Admin Panel', icon: ShieldCheck });
  }

  navItems.push({ id: 'settings' as ViewType, label: 'Settings', icon: Settings });

  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">DataSwift</span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${currentView === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'text-slate-400 hover:bg-slate-800'}
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-all font-medium"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200">
          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex flex-col">
            <h1 className="text-lg font-bold text-slate-800 capitalize">{currentView.replace('-', ' ')}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm ring-2 ring-indigo-50">
              <img src="https://picsum.photos/100/100" alt="User" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;