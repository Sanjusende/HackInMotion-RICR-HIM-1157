import React from 'react';
import {
  Sun,
  ShieldCheck,
  Droplets,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sprout,
} from 'lucide-react';

const HeaderStats = ({ isDemoMode, dashboardData, effectiveFarm, market, cropHealth, t }) => {
  // Soil Moisture computations
  const soilMoistureVal = isDemoMode ? 42 : dashboardData?.soilMoisture || 68;
  const isSoilDry = soilMoistureVal < 50;

  // Active Alerts count
  const alertCount = 3; // Demomode alert count

  // Market change computations
  const currentPrice = market?.currentPrice || 2450;
  const changePercent = market?.changePercent || 4.2;
  const isRising = market?.trend !== 'Falling';

  // Crop growth stage progress calculation
  const growthStage = effectiveFarm?.growthStage || 'Vegetative';
  const getGrowthProgress = (stage) => {
    switch (stage.toLowerCase()) {
      case 'germination':
        return 15;
      case 'seedling':
        return 30;
      case 'vegetative':
        return 50;
      case 'flowering':
        return 75;
      case 'milking':
        return 90;
      case 'maturity':
        return 100;
      default:
        return 50;
    }
  };
  const growthProgress = getGrowthProgress(growthStage);

  return (
    <div className="w-full select-none">
      {/* Horizontally scrollable container on mobile, grids on larger screens */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x md:grid md:grid-cols-3 xl:grid-cols-6 md:pb-0 md:overflow-x-visible">
        {/* CARD 1: Today's Weather */}
        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md dark:hover:shadow-slate-950 transition-all duration-300 flex flex-col justify-between h-36 group">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Weather Station
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">28°C</p>
            </div>
            <div className="p-2 bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Sun size={18} className="animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-450 truncate">
              Clear Sky • Rain 10%
            </span>
            {/* Mini temp gauge slider */}
            <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                style={{ width: '65%' }}
              />
            </div>
          </div>
        </div>

        {/* CARD 2: Farm Health Score */}
        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md dark:hover:shadow-slate-950 transition-all duration-300 flex flex-col justify-between h-36 group">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Farm Health
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">92%</p>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
              <ShieldCheck size={18} />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              Excellent Health
            </span>
            {/* Circular score ring */}
            <svg className="w-6 h-6 -rotate-95" viewBox="0 0 36 36">
              <circle
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="15"
              />
              <circle
                className="text-emerald-500"
                strokeWidth="3"
                strokeDasharray="92 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="15"
              />
            </svg>
          </div>
        </div>

        {/* CARD 3: Soil Moisture */}
        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md dark:hover:shadow-slate-950 transition-all duration-300 flex flex-col justify-between h-36 group">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Soil Moisture
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {soilMoistureVal}%
              </p>
            </div>
            <div
              className={`p-2 rounded-2xl group-hover:scale-110 transition-transform ${isSoilDry ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}
            >
              <Droplets size={18} />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isSoilDry ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400' : 'text-blue-700 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400'}`}
            >
              {isSoilDry ? 'Needs Water' : 'Balanced'}
            </span>
            {/* Liquid progress bar */}
            <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isSoilDry ? 'bg-amber-500' : 'bg-blue-500'}`}
                style={{ width: `${soilMoistureVal}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 4: Market Trend */}
        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md dark:hover:shadow-slate-950 transition-all duration-300 flex flex-col justify-between h-36 group">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {effectiveFarm?.currentCrop || 'Wheat'} Price
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">₹{currentPrice}</p>
            </div>
            <div
              className={`p-2 rounded-2xl group-hover:scale-110 transition-transform ${isRising ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'}`}
            >
              {isRising ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 gap-2">
            <span
              className={`text-[11px] font-bold ${isRising ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-450' : 'text-rose-700 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-450'} px-2 py-0.5 rounded-full whitespace-nowrap`}
            >
              {isRising ? `+${changePercent}%` : `-${changePercent}%`} Upward
            </span>
            {/* Sparkline mini chart */}
            <svg
              className="w-16 h-8 text-emerald-500 dark:text-emerald-400 overflow-visible"
              viewBox="0 0 100 40"
            >
              <path
                d={
                  isRising
                    ? 'M0,35 Q15,28 30,32 T60,18 T90,8 T100,5'
                    : 'M0,10 Q15,18 30,12 T60,25 T90,32 T100,38'
                }
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* CARD 5: Crop Status */}
        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md dark:hover:shadow-slate-950 transition-all duration-300 flex flex-col justify-between h-36 group">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Crop Status
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white truncate max-w-[140px]">
                {effectiveFarm?.currentCrop || 'Wheat'}
              </p>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Sprout size={18} />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full">
              {growthStage} Stage
            </span>
            {/* Linear progress bar */}
            <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${growthProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 6: Active Alerts */}
        <div className="min-w-[260px] sm:min-w-0 snap-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md dark:hover:shadow-slate-950 transition-all duration-300 flex flex-col justify-between h-36 group">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Active Alerts
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {alertCount} Alerts
              </p>
            </div>
            <div className="p-2 bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 transition-transform relative">
              <AlertTriangle size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 px-2 py-0.5 rounded-full">
              Pest & Rain
            </span>
            {/* Warning severity dots */}
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderStats;
