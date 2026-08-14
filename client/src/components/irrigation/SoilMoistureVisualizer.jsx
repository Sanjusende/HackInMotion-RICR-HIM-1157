import React from 'react';
import { Gauge, Info } from 'lucide-react';

const SoilMoistureVisualizer = ({ moisture = 38 }) => {
  const isLow = moisture < 45;
  const isHigh = moisture > 70;
  let statusText = 'Optimal Soil Moisture';
  let badgeStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  let barColor = 'bg-emerald-500';

  if (isLow) {
    statusText = 'Irrigation Recommended (Low Moisture)';
    badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300';
    barColor = 'bg-amber-500';
  } else if (isHigh) {
    statusText = 'High Soil Saturation (No Water Needed)';
    badgeStyle = 'bg-sky-100 text-sky-900 border-sky-300';
    barColor = 'bg-sky-500';
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Gauge size={14} className="text-emerald-600" />
          Soil Moisture Visualizer
        </h2>
        <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold border ${badgeStyle}`}>
          {statusText}
        </span>
      </div>

      {/* Moisture Visual Bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-black text-slate-900">{moisture}%</span>
          <span className="text-xs font-semibold text-slate-500">
            Target Range: <strong className="text-emerald-700">45% – 70%</strong>
          </span>
        </div>

        <div className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
          {/* Target Zone Highlight background */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-100/80 border-x border-emerald-300 pointer-events-none"
            style={{ left: '45%', width: '25%' }}
          />

          {/* Progress Bar */}
          <div
            className={`h-full rounded-full transition-all duration-500 shadow-xs ${barColor}`}
            style={{ width: `${Math.min(100, Math.max(5, moisture))}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] font-bold text-slate-400">
          <span>0% (Dry)</span>
          <span className="text-emerald-700 font-extrabold">45% - 70% Optimal Zone</span>
          <span>100% (Saturated)</span>
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-600">
        <Info size={14} className="text-emerald-600 shrink-0" />
        <span>
          Root zone sensors measure soil moisture at 15cm & 30cm depths to prevent under-watering.
        </span>
      </div>
    </div>
  );
};

export default SoilMoistureVisualizer;
