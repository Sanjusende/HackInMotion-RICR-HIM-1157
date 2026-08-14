import React from 'react';
import { getWeatherIcon } from './CurrentWeather';
import { Calendar } from 'lucide-react';

const DailyForecast = ({ forecast }) => {
  // If API forecast data exists, use it; otherwise fallback cleanly
  const daysList =
    forecast && forecast.length > 0
      ? forecast.slice(0, 5)
      : [
          {
            date: 'Today',
            tempMax: 28,
            tempMin: 21,
            condition: 'Partly Cloudy',
            rainProbability: 25,
          },
          {
            date: 'Tomorrow',
            tempMax: 27,
            tempMin: 20,
            condition: 'Light Rain',
            rainProbability: 60,
          },
          { date: 'Sat', tempMax: 29, tempMin: 21, condition: 'Sunny', rainProbability: 10 },
          {
            date: 'Sun',
            tempMax: 28,
            tempMin: 22,
            condition: 'Partly Cloudy',
            rainProbability: 30,
          },
          { date: 'Mon', tempMax: 30, tempMin: 23, condition: 'Clear Sky', rainProbability: 5 },
        ];

  const formatDateLabel = (rawDate, index) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return rawDate;
      return d.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });
    } catch (e) {
      return rawDate;
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar size={14} className="text-emerald-600" />
          5-Day Forecast
        </h2>
        <span className="text-[11px] font-bold text-slate-400">High / Low</span>
      </div>

      <div className="space-y-2">
        {daysList.map((day, idx) => {
          const isToday = idx === 0;
          const dayLabel = formatDateLabel(day.date, idx);
          const maxT = Math.round(day.tempMax ?? 28);
          const minT = Math.round(day.tempMin ?? 20);

          return (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors text-xs font-semibold ${
                isToday
                  ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-bold'
                  : 'bg-slate-50/80 hover:bg-slate-100/70 border border-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-[120px]">
                {getWeatherIcon(day.condition, 'w-5 h-5 text-emerald-600 shrink-0')}
                <span className="font-extrabold text-slate-900">{dayLabel}</span>
              </div>

              <span className="text-slate-500 hidden sm:inline-block text-[11px]">
                {day.condition}
              </span>

              <div className="flex items-center gap-3">
                {day.rainProbability !== undefined && (
                  <span className="text-[11px] font-bold text-sky-600">
                    💧 {day.rainProbability}%
                  </span>
                )}
                <span className="font-black text-slate-900 text-right w-16">
                  {maxT}° / {minT}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
