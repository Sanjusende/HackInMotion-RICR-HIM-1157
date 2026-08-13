import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, LayoutDashboard, CloudRain, Droplets, TrendingUp, Mic, LogOut, User, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Irrigation', path: '/irrigation', icon: Droplets },
    { label: 'Crop Health', path: '/crop-health', icon: Sprout },
    { label: 'Market', path: '/market', icon: TrendingUp },
    { label: 'KrishiMitra', path: '/voice-assistant', icon: Mic }
  ];

  const publicLandingLinks = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Get Started', href: '#get-started' }
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm'
          : 'bg-white/95 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center gap-4">
          
          {/* KrishiMitra Logo */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center space-x-2 text-emerald-800 font-bold text-xl cursor-pointer shrink-0"
          >
            <div className="p-1.5 bg-emerald-600 text-white rounded-xl shadow-sm">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="text-slate-900 tracking-tight font-extrabold text-2xl">
              Krishi<span className="text-emerald-600">Mitra</span>
            </span>
          </Link>

          {/* Navigation Links — Clean, Direct, No Hamburger/Menu Toggle */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center space-x-3 sm:space-x-6 text-xs font-bold text-slate-600 overflow-x-auto no-scrollbar py-1">
              {publicLandingLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-emerald-600 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/farm-profile"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Farm Setup
                </Link>
                <Button variant="secondary" size="sm" onClick={logout} className="flex items-center gap-1 text-xs">
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm" className="font-bold text-xs px-3 py-1.5">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="font-bold text-xs px-3.5 py-1.5 flex items-center gap-1 shadow-sm">
                    <Sparkles size={13} /> Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
