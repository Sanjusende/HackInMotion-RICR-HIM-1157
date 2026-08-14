import React from 'react';
import { Droplets, RefreshCw } from 'lucide-react';

const IrrigationHeader = ({ analyzing, onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Irrigation
          </h1>
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Smart Water Engine Active
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Personalized crop water requirements and soil moisture recommendations for your farm.
        </p>
      </div>

      <button
        onClick={onRefresh}
        disabled={analyzing}
        className="self-start sm:self-center px-3.5 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-xl transition-all duration-200 flex items-center gap-2 text-xs font-bold border border-slate-200 hover:border-emerald-300 cursor-pointer shadow-2xs disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${analyzing ? 'animate-spin' : ''}`} />
        <span>{analyzing ? 'Analyzing...' : 'Refresh Recommendation'}</span>
      </button>
    </div>
  );
};

export default IrrigationHeader;
