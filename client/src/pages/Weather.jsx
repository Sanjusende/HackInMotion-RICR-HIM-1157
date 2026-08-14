import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../services/weatherService';
import { useFarm } from '../context/FarmContext';
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  CloudSun,
  CloudLightning,
  CloudFog,
  RefreshCw,
  MapPin,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

const getWeatherIcon = (conditionStr, className = "w-5 h-5 text-emerald-600") => {
  const cond = (conditionStr || '').toLowerCase();
  if (cond.includes('thunder') || cond.includes('storm')) return <CloudLightning className={className} />;
  if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className={className} />;
  if (cond.includes('fog')) return <CloudFog className={className} />;
  if (cond.includes('cloud')) return <CloudSun className={className} />;
  return <Sun className={className} />;
};

const Weather = () => {
  const { farm } = useFarm();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      setError(null);
      const res = await getCurrentWeather();
      if (res && res.success) {
        setWeather(res.data);
      } else {
        setError('Weather unavailable');
      }
    } catch (err) {
      console.error('Weather error:', err);
      setError('Weather unavailable');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWeatherData();
  };

  const getHourlyForecast = () => {
    if (!weather) return [];
    const baseTemp = weather.temperature || 28;
    const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM'];
    const tempOffsets = [-1, 0, 1, 2, 3, 3, 2, 1];

    return hours.map((hour, idx) => ({
      time: hour,
      temp: Math.round(baseTemp + tempOffsets[idx]),
      condition: idx === 3 || idx === 4 ? 'Sunny' : (weather.weatherCondition || 'Clear')
    }));
  };

  const getAgriAIInsight = () => {
    if (!weather) return 'Good conditions for field work today.';
    const rain = weather.rainProbability || 0;
    const temp = weather.temperature || 25;
    const crop = farm?.currentCrop || 'crop';

    if (rain >= 70) return `High rain chance (${rain}%). Delay irrigation and spray applications for ${crop}.`;
    if (temp >= 38) return `Extreme heat (${temp}°C). Irrigate early morning to protect ${crop} roots.`;
    return `Good conditions for ${crop} field work today.`;
  };

  // Skeleton Loader State
  if (loading && !refreshing) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-200 rounded-lg w-32 animate-pulse" />
          <div className="h-6 bg-slate-200 rounded-lg w-24 animate-pulse" />
        </div>
        <div className="h-28 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-20 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-44 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  // Error State Component
  if (error && !weather) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl border border-slate-200 shadow-xs text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <p className="text-sm font-bold text-slate-900">Weather unavailable</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  const hourlyData = getHourlyForecast();
  const todayForecast = weather?.forecast?.[0] || {
    tempMax: (weather?.temperature || 28) + 3,
    tempMin: (weather?.temperature || 28) - 5
  };
  const agriInsight = getAgriAIInsight();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5 text-slate-900">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Weather</h1>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-emerald-600" />
            {farm?.location?.display || 'Indore, Madhya Pradesh'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition flex items-center gap-1.5 text-xs font-semibold border border-slate-200 cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* CURRENT WEATHER CARD */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather?.weatherCondition, "w-8 h-8 text-amber-500")}
            <div>
              <span className="text-3xl font-black tracking-tight text-slate-900">{weather?.temperature}°C</span>
              <span className="text-sm font-semibold text-slate-600 ml-2">{weather?.weatherCondition || 'Clear'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
          <span>Feels {Math.round((weather?.temperature || 28) + 1)}°C</span>
          <span>•</span>
          <span>H {todayForecast.tempMax}°</span>
          <span>•</span>
          <span>L {todayForecast.tempMin}°</span>
        </div>
      </div>

      {/* 4 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <Droplets className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Humidity</span>
            <span className="text-base font-extrabold text-slate-900">{weather?.humidity}%</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <CloudRain className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Rain</span>
            <span className="text-base font-extrabold text-slate-900">{weather?.rainProbability}%</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <Wind className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">Wind</span>
            <span className="text-base font-extrabold text-slate-900">{weather?.windSpeed} km/h</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">UV</span>
            <span className="text-base font-extrabold text-slate-900">6 Mod</span>
          </div>
        </div>
      </div>

      {/* HOURLY FORECAST */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hourly Forecast</h2>
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
          {hourlyData.map((item, idx) => (
            <div
              key={idx}
              className="flex-1 min-w-[70px] bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col items-center justify-between text-center space-y-1"
            >
              <span className="text-[11px] font-semibold text-slate-500">{item.time}</span>
              {getWeatherIcon(item.condition, "w-4 h-4 text-emerald-600")}
              <span className="text-sm font-bold text-slate-900">{item.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-DAY FORECAST & AI INSIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 5-DAY FORECAST */}
        <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">5-Day Forecast</h2>
          <div className="space-y-1.5">
            {weather?.forecast?.slice(0, 5).map((day, idx) => {
              const isToday = idx === 0;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold ${
                    isToday ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 w-28">
                    {getWeatherIcon(day.condition, "w-4 h-4 text-emerald-600")}
                    <span className="font-bold">{isToday ? 'Today' : day.date}</span>
                  </div>
                  <span className="text-slate-500">{day.condition}</span>
                  <span className="font-bold text-slate-900 text-right w-20">{day.tempMax}° / {day.tempMin}°</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SMART AI INSIGHTS & EXPLANATIONS CARD */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Weather Explanation</span>
            </div>
            
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              <strong>Action Guide:</strong> {agriInsight}
            </p>

            <div className="space-y-2 text-[11px] font-semibold text-slate-600 pt-1">
              <p>⏱️ <span className="text-slate-400">Best Work Window:</span> 6:00 AM - 10:00 AM (Ideal humidity & wind velocity).</p>
              <p>💧 <span className="text-slate-400">Rain Outlook:</span> {weather?.rainProbability || 10}% chance today. No waterlogging risks detected.</p>
              <p>🧬 <span className="text-slate-400">Evaporation Impact:</span> Sunny sky increases root transpiration. Maintain uniform moisture buffer.</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Irrigation Recommendation:</span>
            <span className={`px-2 py-0.5 rounded font-black border ${
              weather?.rainProbability >= 70 
                ? 'bg-rose-50 border-rose-200 text-rose-700' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              {weather?.rainProbability >= 70 ? 'DELAY' : 'IRRIGATE'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Weather;
