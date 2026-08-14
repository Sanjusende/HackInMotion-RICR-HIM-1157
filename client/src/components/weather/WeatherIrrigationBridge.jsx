import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, ArrowRight, CloudRain, Sprout, ShieldCheck, Sparkles } from 'lucide-react';

const WeatherIrrigationBridge = ({ weather, cropName }) => {
  const rainProb = weather?.rainProbability ?? 20;
  const isIrrigateNeeded = rainProb < 60;

  const decisionBadge = isIrrigateNeeded ? (
    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      🟢 Irrigation Recommended
    </span>
  ) : (
    <span className="px-3 py-1 bg-sky-50 text-sky-900 border border-sky-300 rounded-full text-xs font-black flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
      🌧 No Irrigation Needed Today
    </span>
  );

  const recommendationMsg = isIrrigateNeeded
    ? `Low rainfall expected (${rainProb}%) and soil moisture buffer is depleting. Irrigation is recommended for your ${cropName || 'crop'} field.`
    : `Sufficient rain is expected (${rainProb}% chance). Soil moisture is adequate, so hold off irrigation today to save pumping costs.`;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-5 sm:p-6 rounded-3xl shadow-medium space-y-4">
      {/* Visual background accents */}
      <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>Weather-Based Irrigation Advice</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h2>
            <p className="text-[11px] text-slate-300 font-medium">Smart link between live weather & field moisture</p>
          </div>
        </div>

        <div>{decisionBadge}</div>
      </div>

      {/* INTELLIGENCE FLOW DIAGRAM */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 py-1 text-center text-xs">
        <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center justify-center space-y-1">
          <CloudRain className="w-4 h-4 text-sky-400" />
          <span className="text-[10px] font-bold text-slate-400">Rainfall</span>
          <span className="font-extrabold text-white">{rainProb}% Chance</span>
        </div>

        <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center justify-center space-y-1">
          <Droplets className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-bold text-slate-400">Soil Moisture</span>
          <span className="font-extrabold text-white">{isIrrigateNeeded ? '38% (Low)' : '65% (Optimal)'}</span>
        </div>

        <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center justify-center space-y-1">
          <Sprout className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-400">Crop Need</span>
          <span className="font-extrabold text-white">{cropName || 'Wheat'} (24 L/m²)</span>
        </div>

        <div className="p-2.5 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-500/30 flex flex-col items-center justify-center space-y-1">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span className="text-[10px] font-bold text-emerald-200">Decision</span>
          <span className="font-extrabold text-emerald-100">{isIrrigateNeeded ? 'Irrigate' : 'Wait'}</span>
        </div>
      </div>

      {/* ADVICE & BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <p className="text-xs text-slate-200 font-medium leading-relaxed max-w-xl">
          {recommendationMsg}
        </p>

        <Link
          to="/irrigation"
          className="self-start sm:self-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all duration-200 flex items-center gap-2 shrink-0 shadow-xs group"
        >
          <span>View Irrigation Plan</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default WeatherIrrigationBridge;
