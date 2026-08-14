import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Home, 
  ArrowLeft, 
  Compass, 
  LayoutDashboard, 
  CloudRain, 
  Droplets, 
  Activity, 
  TrendingUp 
} from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Farm Setup', path: '/farm-profile', icon: Sprout },
    { label: 'Weather Telemetry', path: '/weather', icon: CloudRain },
    { label: 'Irrigation Logs', path: '/irrigation', icon: Droplets },
    { label: 'Crop Diagnosis', path: '/crop-health', icon: Activity },
    { label: 'Mandi Prices', path: '/market', icon: TrendingUp },
  ];

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-slate-50 to-teal-50 overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.08); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />

      {/* Glassmorphic Container */}
      <div className="relative max-w-2xl w-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-6 sm:p-10 md:p-12 text-center space-y-8 z-10 transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center space-x-2 pb-2">
          <div className="p-1.5 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="text-slate-900 tracking-tight font-extrabold text-xl">
            Krishi<span className="text-emerald-600">Mitra</span>
          </span>
        </div>

        {/* 404 Illustration / Art */}
        <div className="relative flex justify-center items-center py-4">
          <div className="absolute w-48 h-48 bg-emerald-100 rounded-full blur-xl opacity-40 animate-pulse-slow" />
          
          <div className="relative animate-float flex flex-col items-center">
            {/* Compass / Search Graphic */}
            <div className="relative p-5 bg-white rounded-3xl border border-emerald-100 shadow-md">
              <Compass className="w-20 h-20 text-emerald-600 stroke-[1.5]" />
              <div className="absolute -bottom-2 -right-2 p-2 bg-amber-500 text-white rounded-xl shadow">
                <span className="text-xs font-black">404</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Header */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Lost in the Fields?
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 max-w-md mx-auto">
          <Link to="/" className="flex-1">
            <Button 
              variant="primary" 
              className="w-full flex items-center justify-center gap-2 py-3 font-bold rounded-xl shadow-lg shadow-emerald-600/10 cursor-pointer text-sm"
              aria-label="Back to Home"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer text-sm"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Quick Links Section */}
        <div className="pt-6 border-t border-slate-200/50 space-y-4">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
            Common Destinations
          </span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-900 text-xs font-bold text-slate-600 transition"
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
