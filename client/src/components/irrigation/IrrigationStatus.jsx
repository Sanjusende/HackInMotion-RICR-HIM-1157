import React from 'react';
import { Droplets, Clock, Gauge, Sprout, TrendingUp, AlertTriangle } from 'lucide-react';

const IrrigationStatus = ({ selectedField, isIrrigateNeeded, calculatedLiters }) => {
  const crop = selectedField?.crop || 'Wheat';
  const fieldName = selectedField?.name || 'Field 01';
  const moisture = selectedField?.soilMoisture ?? 38;
  const statusLabel = isIrrigateNeeded ? '🟡 Irrigation Required' : '🟢 Optimal Moisture';
  const waterVol = calculatedLiters || 1200;
  const nextIrrigation = isIrrigateNeeded ? 'Tomorrow 6:00 AM' : 'No Irrigation Needed';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>Irrigation Status</span>
              <span className="text-slate-400 text-xs font-normal">({fieldName} • {crop})</span>
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">Real-time water demand summary</p>
          </div>
        </div>

        <span className={`px-3 py-1 text-xs font-black rounded-full border ${
          isIrrigateNeeded ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* FIELD & CROP */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Field & Crop</span>
          <p className="text-base font-black text-slate-900 flex items-center gap-1">
            <Sprout size={16} className="text-emerald-600 shrink-0" />
            {crop} Field
          </p>
          <p className="text-[10px] font-semibold text-slate-500">{selectedField?.area || 12} Acres registered</p>
        </div>

        {/* SOIL MOISTURE */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Soil Moisture</span>
          <p className="text-base font-black text-slate-900 flex items-center gap-1">
            <Gauge size={16} className="text-sky-600 shrink-0" />
            {moisture}%
          </p>
          <p className="text-[10px] font-bold text-amber-700">
            {moisture < 45 ? 'Below optimal (45%-70%)' : 'Optimal range'}
          </p>
        </div>

        {/* NEXT IRRIGATION */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Next Irrigation</span>
          <p className="text-xs font-black text-slate-900 flex items-center gap-1">
            <Clock size={15} className="text-teal-600 shrink-0" />
            {nextIrrigation}
          </p>
          <p className="text-[10px] font-semibold text-slate-500">Best morning window</p>
        </div>

        {/* WATER REQUIRED */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Water Required</span>
          <p className="text-base font-black text-slate-900 flex items-center gap-1">
            <Droplets size={16} className="text-blue-600 shrink-0" />
            {waterVol.toLocaleString()} L
          </p>
          <p className="text-[10px] font-semibold text-slate-500">~35-45 minutes pump time</p>
        </div>
      </div>
    </div>
  );
};

export default IrrigationStatus;
