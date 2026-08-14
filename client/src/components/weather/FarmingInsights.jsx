import React from 'react';
import { Droplets, SprayCan, Tractor, CloudRain, Sparkles } from 'lucide-react';

const FarmingInsights = ({ weather }) => {
  const rainProb = weather?.rainProbability ?? 20;
  const windSpeed = weather?.windSpeed ?? 12;
  const temp = weather?.temperature ?? 28;

  // 1. Irrigation insight
  const isIrrigateRecommended = rainProb < 50;
  const irrigationTag = isIrrigateRecommended ? 'Recommended' : 'Hold Off';
  const irrigationMsg = isIrrigateRecommended
    ? 'Low rainfall expected. Irrigation may be required today.'
    : `Rain probability is high (${rainProb}%). Delay irrigation to conserve water.`;

  // 2. Spraying insight
  const isSprayingGood = windSpeed <= 15;
  const sprayingTag = isSprayingGood ? 'Good' : 'Avoid Spraying';
  const sprayingMsg = isSprayingGood
    ? `Wind speed (${windSpeed} km/h) is safe for chemical spraying.`
    : `Wind speed is high (${windSpeed} km/h). Spraying might drift.`;

  // 3. Field Work insight
  const isFieldWorkGood = rainProb < 70 && temp < 38;
  const fieldWorkTag = isFieldWorkGood ? 'Good' : 'Caution';
  const fieldWorkMsg = isFieldWorkGood
    ? 'Weather conditions are suitable for tilling and harvesting.'
    : 'Ground moisture or heat levels are elevated. Plan field work carefully.';

  // 4. Rainfall insight
  const tomorrowRain = weather?.forecast?.[1]?.rainProbability ?? rainProb;
  const isRainTomorrow = tomorrowRain >= 40;
  const rainTag = isRainTomorrow ? 'Expected' : 'Low Chance';
  const rainMsg = isRainTomorrow
    ? `Rain expected tomorrow (~${tomorrowRain}% chance). Prepare field drainage.`
    : 'Clear skies expected tomorrow. No heavy rainfall risks detected.';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Farming Insights
        </h2>
        <span className="text-[11px] font-bold text-slate-400">Dynamic Advice</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* IRRIGATION CARD */}
        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70 hover:border-emerald-300 transition-colors flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Irrigation</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  isIrrigateRecommended
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {irrigationTag}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-snug">{irrigationMsg}</p>
          </div>
        </div>

        {/* SPRAYING CARD */}
        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70 hover:border-emerald-300 transition-colors flex items-start gap-3">
          <div className="p-2 bg-teal-50 text-teal-600 rounded-lg shrink-0 mt-0.5">
            <SprayCan className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Spraying</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  isSprayingGood ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {sprayingTag}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-snug">{sprayingMsg}</p>
          </div>
        </div>

        {/* FIELD WORK CARD */}
        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70 hover:border-emerald-300 transition-colors flex items-start gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
            <Tractor className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Field Work</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  isFieldWorkGood
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {fieldWorkTag}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-snug">{fieldWorkMsg}</p>
          </div>
        </div>

        {/* RAINFALL CARD */}
        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70 hover:border-emerald-300 transition-colors flex items-start gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
            <CloudRain className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Rainfall</span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  isRainTomorrow ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {rainTag}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-snug">{rainMsg}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmingInsights;
