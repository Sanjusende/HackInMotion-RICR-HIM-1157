import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const FarmingConditions = ({ weather, cropName }) => {
  const rainProb = weather?.rainProbability ?? 20;
  const temp = weather?.temperature ?? 28;
  const wind = weather?.windSpeed ?? 12;

  let status = 'GOOD';
  let badgeText = '🟢 Good for farming';
  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
  let explanation = `Today's weather is suitable for irrigation, fertilization, and general field operations for your ${cropName || 'crop'}.`;

  if (rainProb >= 70 || temp >= 39 || wind >= 25) {
    status = 'POOR';
    badgeText = '🔴 Poor conditions';
    badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
    icon = <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />;
    
    if (rainProb >= 70) {
      explanation = `High chance of heavy rain (${rainProb}%). Delay chemical sprays and hold off irrigation to prevent soil erosion & runoff.`;
    } else if (temp >= 39) {
      explanation = `Extreme high temperature (${temp}°C). Protect ${cropName || 'crop'} against heat stress and irrigate during cool early morning hours.`;
    } else {
      explanation = `Strong winds (${wind} km/h). Postpone pesticide spraying to avoid drift and crop loss.`;
    }
  } else if (rainProb >= 40 || temp >= 35 || wind >= 18) {
    status = 'MODERATE';
    badgeText = '🟡 Moderate conditions';
    badgeColor = 'bg-amber-50 text-amber-900 border-amber-200';
    icon = <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />;
    explanation = `Moderate weather conditions. Monitor soil moisture levels closely and schedule light field activities for ${cropName || 'fields'}.`;
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" />
          Farming Conditions
        </h2>
        <span className={`px-3 py-1 text-xs font-black rounded-full border flex items-center gap-1.5 ${badgeColor}`}>
          {badgeText}
        </span>
      </div>

      <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs font-semibold text-slate-700 leading-relaxed">
        {icon}
        <p className="mt-0.5">{explanation}</p>
      </div>
    </div>
  );
};

export default FarmingConditions;
