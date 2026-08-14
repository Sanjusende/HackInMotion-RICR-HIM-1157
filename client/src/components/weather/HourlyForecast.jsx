import React from 'react';
import { getWeatherIcon } from './CurrentWeather';
import { Clock } from 'lucide-react';

const HourlyForecast = ({ weather }) => {
  const baseTemp = weather?.temperature ?? 28;
  const baseCondition = weather?.weatherCondition || 'Clear';
  const baseRain = weather?.rainProbability ?? 15;

  const hoursList = [
    { time: '6 AM', tempOffset: -3, rainOffset: -5, cond: 'Clear Sky' },
    { time: '8 AM', tempOffset: -1, rainOffset: -2, cond: baseCondition },
    { time: '10 AM', tempOffset: 0, rainOffset: 0, cond: baseCondition },
    { time: '12 PM', tempOffset: 2, rainOffset: 5, cond: 'Sunny' },
    { time: '2 PM', tempOffset: 4, rainOffset: 10, cond: 'Sunny' },
    { time: '4 PM', tempOffset: 3, rainOffset: 5, cond: baseCondition },
    { time: '6 PM', tempOffset: 1, rainOffset: -2, cond: baseCondition },
    { time: '8 PM', tempOffset: -1, rainOffset: -5, cond: 'Clear Sky' }
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Clock size={14} className="text-emerald-600" />
          Hourly Weather
        </h2>
        <span className="text-[11px] font-bold text-slate-400">Scroll Horizontal ➔</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {hoursList.map((item, idx) => {
          const tempVal = Math.round(baseTemp + item.tempOffset);
          const rainVal = Math.max(0, Math.min(100, Math.round(baseRain + item.rainOffset)));

          return (
            <div
              key={idx}
              className="flex-1 min-w-[76px] bg-slate-50/90 hover:bg-emerald-50/60 p-3 rounded-xl border border-slate-200/70 hover:border-emerald-300 transition-all duration-200 flex flex-col items-center justify-between text-center space-y-1.5 shrink-0"
            >
              <span className="text-[11px] font-bold text-slate-500">{item.time}</span>
              <div className="my-1">
                {getWeatherIcon(item.cond, "w-6 h-6 text-amber-500")}
              </div>
              <span className="text-base font-black text-slate-900">{tempVal}°</span>
              <span className="text-[10px] font-extrabold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                💧 {rainVal}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
