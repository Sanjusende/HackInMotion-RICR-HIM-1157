import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  CloudRain,
  Droplets,
  TrendingUp,
  Mic,
  LogOut,
  User,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Weather', path: '/weather', icon: CloudRain },
    { label: 'Irrigation', path: '/irrigation', icon: Droplets },
    { label: 'Crop Health', path: '/crop-health', icon: Sprout },
    { label: 'Market', path: '/market', icon: TrendingUp },
    { label: 'KrishiMitra', path: '/voice-assistant', icon: Mic },
  ];

  const publicLandingLinks = [
    { label: 'Home', href: '#' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Get Started', href: '#get-started' },
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

          {/* Navigation Links — Desktop */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-1 py-1">
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
            <div className="hidden md:flex items-center space-x-3 sm:space-x-6 text-xs font-bold text-slate-600 py-1">
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

          {/* Action Buttons — Desktop */}
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/farm-profile"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Farm Setup
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-1 text-xs"
                >
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
                  <Button
                    variant="primary"
                    size="sm"
                    className="font-bold text-xs px-3.5 py-1.5 flex items-center gap-1 shadow-sm"
                  >
                    <Sparkles size={13} /> Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-50 border border-slate-100 transition focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300">
          <div className="px-4 pt-3 pb-4 space-y-3">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                        active
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="border-t border-slate-100 my-2 pt-2 flex flex-col gap-2">
                  <Link
                    to="/farm-profile"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    Farm Setup
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 text-sm py-2.5 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-1">
                {publicLandingLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-slate-100 my-2 pt-2 flex flex-col gap-2">
                  <Link to="/login" className="w-full">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full font-bold text-sm py-2.5"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full font-bold text-sm py-2.5 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Sparkles size={14} /> Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
