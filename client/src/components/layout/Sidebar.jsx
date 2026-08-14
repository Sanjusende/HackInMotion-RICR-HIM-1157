import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  LayoutDashboard, 
  User, 
  CloudRain, 
  Sparkles, 
  Droplets, 
  TrendingUp, 
  Layers, 
  Settings, 
  LogOut, 
  X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Farm Profile', path: '/farm-profile', icon: User },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Crop Recommendation', path: '/crop-recommendation', icon: Sparkles },
    { label: 'Irrigation', path: '/irrigation', icon: Droplets },
    { label: 'Crop Health', path: '/crop-health', icon: Sprout },
    { label: 'Market', path: '/market', icon: TrendingUp },
    { label: 'Reports', path: '/dashboard', icon: Layers },
    { label: 'Settings', path: '/farm-profile', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-border-custom px-4 py-6 shadow-small">
      {/* Header / Logo */}
      <div className="flex items-center justify-between mb-8 px-2 shrink-0">
        <Link to="/dashboard" className="flex items-center space-x-2.5">
          <div className="p-2 bg-primary text-white rounded-xl shadow-small">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-dark-text tracking-tight font-extrabold text-xl">
            Krishi<span className="text-primary">Mitra</span>
          </span>
        </Link>
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden p-1.5 hover:bg-bg-custom rounded-xl text-secondary-text cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className="relative block group"
              onClick={onClose}
            >
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-205 ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-secondary-text hover:text-primary hover:bg-bg-custom'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-2 bottom-2 w-1.5 bg-primary rounded-r-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-primary' : 'text-secondary-text group-hover:text-primary'}`} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-border-custom shrink-0 px-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-danger hover:bg-rose-50 cursor-pointer transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Collapsible) Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar Panel */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out border-r border-border-custom ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
