import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wallet, 
  MessageSquare, 
  Settings, 
  LogOut,
  Infinity as InfinityIcon,
  X
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNotifications } from '../context/NotificationContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { unreadMessagesCount } = useNotifications();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: MessageSquare, label: 'Messages', path: '/chat', badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 lg:w-72 bg-gray-100 dark:bg-[#131022] p-4 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col md:h-full md:gap-4
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/');
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-[#1A1729] rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-white/10 animate-[fadeIn_0.2s]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Log Out</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors shadow-lg shadow-red-500/20"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className={sidebarClasses}>
        <div className="bg-white dark:bg-[#1A1729] dark:md:glass-panel border border-gray-200 dark:border-white/5 rounded-2xl flex flex-col h-full overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300 relative">
          
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="p-6 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-lg shadow-primary/40">
                <InfinityIcon className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">SubShare</h1>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-[0_0_15px_rgba(71,37,244,0.3)]'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-primary text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
            
            <div className="my-4 border-t border-gray-100 dark:border-white/5 mx-2"></div>
            
            <button 
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
              <span className="font-medium">Log Out</span>
            </button>
          </nav>

          {/* Profile */}
          <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 backdrop-blur-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors" onClick={() => navigate('/settings')}>
            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                src={user.avatar || undefined}
                alt="Profile"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.plan} Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;