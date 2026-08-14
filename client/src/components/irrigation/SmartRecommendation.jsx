import React from 'react';
import { Sparkles, Clock, Droplets, ShieldCheck, ArrowRight } from 'lucide-react';

const SmartRecommendation = ({ result, farm, selectedField, calculatedLiters, onOpenPlan }) => {
  const crop = selectedField?.crop || farm?.currentCrop || 'Wheat';
  const fieldName = selectedField?.name || 'Field 01';
  const confidence = result?.confidence ? Math.round(result.confidence * 100) : 92;
  const decision = result?.decision || (selectedField?.soilMoisture < 45 ? 'IRRIGATE' : 'DONT_IRRIGATE');
  const isIrrigate = decision === 'IRRIGATE';

  const waterVol = calculatedLiters || 1200;
  const recommendedTime = isIrrigate ? 'Tomorrow 6:00 AM – 8:00 AM' : 'No Irrigation Scheduled';
  const reasonText = result?.reasoning?.actionableAdvice ||
    (isIrrigate
      ? `Soil moisture (${selectedField?.soilMoisture ?? 38}%) is below requirement for ${crop} and low rainfall is forecast.`
      : `Soil moisture (${selectedField?.soilMoisture ?? 61}%) is optimal for ${crop}. Conserve water today.`);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-medium space-y-4">
      {/* Background radial highlight */}
      <div className="absolute -right-12 -bottom-12 w-52 h-52 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <h2 className="text-base font-extrabold text-white">KrishiMitra Recommendation</h2>
        </div>

        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-emerald-200 border border-white/15 self-start sm:self-auto">
          Confidence {confidence}%
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-200">🌾 {fieldName} ({crop})</span>
          <span className={`px-3 py-1 text-xs font-black rounded-full border ${
            isIrrigate
              ? 'bg-emerald-500 text-slate-950 border-emerald-400'
              : 'bg-amber-400/20 text-amber-200 border-amber-400/30'
          }`}>
            {isIrrigate ? '🟢 Irrigation Recommended' : '🟡 Hold Off Irrigation'}
          </span>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-200/80 flex items-center gap-1">
              <Clock size={13} className="text-emerald-400" /> Recommended Time Window
            </span>
            <p className="text-sm font-black text-white">{recommendedTime}</p>
          </div>

          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-200/80 flex items-center gap-1">
              <Droplets size={13} className="text-blue-400" /> Water Requirement
            </span>
            <p className="text-sm font-black text-white">{waterVol.toLocaleString()} Liters</p>
          </div>
        </div>

        {/* REASONING */}
        <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 text-xs text-emerald-100 font-medium leading-relaxed">
          <strong className="text-white block mb-0.5">Reason:</strong>
          {reasonText}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <span className="text-[11px] font-semibold text-emerald-200/70">
          SmartAg AI • Stage: {farm?.growthStage || 'Vegetative'}
        </span>

        <button
          onClick={onOpenPlan}
          className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>View Plan</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default SmartRecommendation;
