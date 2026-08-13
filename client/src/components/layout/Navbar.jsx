import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, LayoutDashboard, CloudRain, Droplets, TrendingUp, Mic, LogOut, User, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Irrigation', path: '/irrigation', icon: Droplets },
    { label: 'Crop Health', path: '/crop-health', icon: Sprout },
    { label: 'Market', path: '/market', icon: TrendingUp },
    { label: 'Voice Assistant', path: '/voice-assistant', icon: Mic }
  ];

  const publicLandingLinks = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why KrishiMitra', href: '#why-us' },
    { label: 'Dashboard Preview', href: '#dashboard-preview' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-emerald-100 shadow-sm'
          : 'bg-white/95 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2 text-emerald-800 font-bold text-xl cursor-pointer">
            <div className="p-1.5 bg-emerald-100/80 text-emerald-700 rounded-xl">
              <Sprout className="w-6 h-6 text-emerald-700" />
            </div>
            <span className="text-slate-900 tracking-tight font-extrabold text-2xl">
              Krishi<span className="text-emerald-700">Mitra</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      active ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-6 text-xs font-bold text-slate-600">
              {publicLandingLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-emerald-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/farm-profile"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <User className="w-4 h-4 text-emerald-600" />
                  Farm Setup
                </Link>
                <Button variant="secondary" size="sm" onClick={logout} className="flex items-center gap-1">
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm" className="font-bold">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="font-bold flex items-center gap-1 shadow-sm">
                    <Sparkles size={14} /> Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-slate-900 focus:outline-none p-2 rounded-full cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl absolute top-16 left-0 right-0 py-4 px-6 space-y-3">
          {isAuthenticated ? (
            <div className="flex flex-col space-y-2 pb-3 border-b border-slate-100">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Icon className="w-4 h-4 text-emerald-600" />
                    {link.label}
                  </Link>
                );
              })}
              <Link
                to="/farm-profile"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <User className="w-4 h-4 text-emerald-600" />
                Farm Setup
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pb-3 border-b border-slate-100 text-sm font-semibold text-slate-700">
              {publicLandingLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-col space-y-2 pt-2">
            {isAuthenticated ? (
              <Button variant="secondary" size="md" fullWidth onClick={logout}>
                Log Out
              </Button>
            ) : (
              <>
                <Link to="/login" className="w-full">
                  <Button variant="secondary" size="md" fullWidth>
                    Log In
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button variant="primary" size="md" fullWidth>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
