import React from 'react';
import {
  CloudRain,
  Wind,
  Droplets,
  Sun,
  CloudSun,
  CloudLightning,
  CloudFog,
  Sparkles,
  Thermometer,
} from 'lucide-react';

export const getWeatherIcon = (conditionStr, className = 'w-8 h-8 text-amber-500') => {
  const cond = (conditionStr || '').toLowerCase();
  if (cond.includes('thunder') || cond.includes('storm'))
    return <CloudLightning className={className} />;
  if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className={className} />;
  if (cond.includes('fog')) return <CloudFog className={className} />;
  if (cond.includes('cloud')) return <CloudSun className={className} />;
  return <Sun className={className} />;
};

const CurrentWeather = ({ weather }) => {
  const temp = Math.round(weather?.temperature ?? 28);
  const condition = weather?.weatherCondition || 'Partly Cloudy';
  const humidity = weather?.humidity ?? 65;
  const windSpeed = weather?.windSpeed ?? 12;
  const rainProb = weather?.rainProbability ?? 30;
  const feelsLike = Math.round(temp + 2);

  const todayForecast = weather?.forecast?.[0] || {
    tempMax: temp + 3,
    tempMin: temp - 5,
  };

  // UV calculation heuristic based on weather condition & temp
  const uvIndex = weather?.uvIndex ?? (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('cloud') ? 4 : 7);
  const uvStatus = uvIndex >= 8 ? 'Very High' : uvIndex >= 6 ? 'High' : uvIndex >= 3 ? 'Moderate' : 'Low';

  return (
    <div className="space-y-4">
      {/* HERO CURRENT WEATHER CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-medium">
        {/* Subtle background glow graphics */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-emerald-200 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Current Weather Intelligence</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight drop-shadow-xs">
                {temp}°C
              </span>
              <div>
                <p className="text-lg font-bold text-emerald-100 leading-tight">{condition}</p>
                <p className="text-xs text-emerald-200/80 font-medium">Feels like {feelsLike}°C</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-200/90 pt-1 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Thermometer size={13} className="text-emerald-400" /> H: {todayForecast.tempMax}°C
              </span>
              <span>•</span>
              <span>L: {todayForecast.tempMin}°C</span>
              <span>•</span>
              <span className="text-emerald-300 font-bold">
                {weather?.source === 'open-meteo' ? 'OpenMeteo Live' : 'Cached Data'}
              </span>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8 shrink-0">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-inner">
              {getWeatherIcon(condition, 'w-14 h-14 text-amber-300 drop-shadow-md')}
            </div>
          </div>
        </div>
      </div>

      {/* 4 COMPACT METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Humidity
            </span>
            <span className="text-lg font-black text-slate-900">{humidity}%</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 rounded-xl text-sky-600 shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Rain Chance
            </span>
            <span className="text-lg font-black text-slate-900">{rainProb}%</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Wind Speed
            </span>
            <span className="text-lg font-black text-slate-900">
              {windSpeed} <span className="text-xs font-semibold text-slate-500">km/h</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500 shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              UV Index
            </span>
            <span className="text-lg font-black text-slate-900">
              {uvIndex.toFixed(1)}{' '}
              <span className="text-[11px] font-extrabold text-amber-600">({uvStatus})</span>
            </span>
          </div>
        </div>
      </div>

      {/* SECONDARY METRICS (AQI, Sunrise, Sunset) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors text-xs flex items-center gap-2.5">
          <span className="font-bold text-slate-400 uppercase block tracking-wider text-[10px]">Air Quality:</span>
          <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">{weather?.airQuality || 'Good'}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors text-xs flex items-center gap-2.5">
          <span className="font-bold text-slate-400 uppercase block tracking-wider text-[10px]">Sunrise Time:</span>
          <span className="font-extrabold text-slate-900">{weather?.sunrise || '06:00 AM'}</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors text-xs flex items-center gap-2.5">
          <span className="font-bold text-slate-400 uppercase block tracking-wider text-[10px]">Sunset Time:</span>
          <span className="font-extrabold text-slate-900">{weather?.sunset || '06:40 PM'}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
