import React from 'react';
import { Sprout, TrendingDown, ShieldCheck } from 'lucide-react';

const WaterEfficiencyCard = ({ usedLiters = 1000, recommendedLiters = 1200 }) => {
  const savedLiters = Math.max(0, recommendedLiters - usedLiters);
  const efficiencyPct = Math.min(100, Math.round((usedLiters / recommendedLiters) * 100));

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sprout size={14} className="text-emerald-600" />
          Water Efficiency
        </h2>
        <span className="text-base font-black text-emerald-700">{efficiencyPct}% Efficiency</span>
      </div>

      <div className="space-y-1.5 py-1">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Actual vs. Recommended Volume</span>
          <span className="text-emerald-700 font-bold">{usedLiters}L / {recommendedLiters}L</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${efficiencyPct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Used</span>
          <span className="text-xs font-black text-slate-900">{usedLiters.toLocaleString()} L</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended</span>
          <span className="text-xs font-black text-slate-900">{recommendedLiters.toLocaleString()} L</span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Saved</span>
          <span className="text-xs font-black text-emerald-700">{savedLiters.toLocaleString()} L</span>
        </div>
      </div>

      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
        <span className="font-bold text-emerald-950 flex items-center gap-1.5">
          <TrendingDown size={14} className="text-emerald-600" />
          Water Saving Insight:
        </span>
        <span className="font-extrabold text-emerald-700">Saved {savedLiters} L water this week</span>
      </div>
    </div>
  );
};

export default WaterEfficiencyCard;
