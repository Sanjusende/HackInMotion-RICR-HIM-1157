import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const KrishiMitraFloatingButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide floating button on login/register/landing or if already on voice assistant page
  if (!isAuthenticated || location.pathname === '/voice-assistant') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => navigate('/voice-assistant')}
        aria-label="Ask KrishiMitra"
        title="Ask KrishiMitra"
        className="group relative flex items-center justify-center p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-emerald-600/30 hover:scale-105 transition-all duration-200 cursor-pointer border border-emerald-400/40"
      >
        <div className="flex items-center gap-1.5">
          <Sprout className="w-4 h-4 text-emerald-200" />
          <Mic className="w-5 h-5 text-white animate-pulse" />
        </div>

        {/* Hover Tooltip */}
        <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Ask KrishiMitra
        </span>
      </button>
    </div>
  );
};

export default KrishiMitraFloatingButton;
