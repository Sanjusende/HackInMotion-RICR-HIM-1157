import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../services/weatherService';
import { useFarm } from '../context/FarmContext';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import WeatherHeader from '../components/weather/WeatherHeader';
import CurrentWeather from '../components/weather/CurrentWeather';
import FarmingConditions from '../components/weather/FarmingConditions';
import FarmingInsights from '../components/weather/FarmingInsights';
import HourlyForecast from '../components/weather/HourlyForecast';
import DailyForecast from '../components/weather/DailyForecast';
import WeatherChart from '../components/weather/WeatherChart';
import WeatherAlerts from '../components/weather/WeatherAlerts';
import WeatherIrrigationBridge from '../components/weather/WeatherIrrigationBridge';

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
        setError('Weather unavailable. We couldn\'t load the latest weather information.');
      }
    } catch (err) {
      console.error('Weather error:', err);
      setError('Weather unavailable. We couldn\'t load the latest weather information.');
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

  // Loading Skeleton State
  if (loading && !refreshing) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="h-20 bg-slate-200/80 rounded-2xl animate-pulse" />
        <div className="h-56 bg-slate-200/80 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200/80 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-32 bg-slate-200/80 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-slate-200/80 rounded-2xl animate-pulse" />
          <div className="h-64 bg-slate-200/80 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Error State Component
  if (error && !weather) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-black text-slate-900">Weather Unavailable</h2>
          <p className="text-xs text-slate-500 font-medium">{error}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-2 mx-auto shadow-xs"
        >
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const locationDisplay = farm?.location?.display || 'Indore, Madhya Pradesh';
  const cropName = farm?.currentCrop || 'Wheat';

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* 1. HEADER */}
      <WeatherHeader
        locationName={locationDisplay}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        lastUpdated={weather?.fetchedAt ? new Date(weather.fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
      />

      {/* 2. CURRENT WEATHER HERO & METRICS */}
      <CurrentWeather weather={weather} />

      {/* 3. FARMING WEATHER STATUS */}
      <FarmingConditions weather={weather} cropName={cropName} />

      {/* 4. AGRICULTURE WEATHER INSIGHTS */}
      <FarmingInsights weather={weather} />

      {/* 5 & 6. HOURLY & 5-DAY FORECASTS & TEMPERATURE CHART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* HOURLY FORECAST */}
          <HourlyForecast weather={weather} />

          {/* TEMPERATURE & RAIN CHART */}
          <WeatherChart weather={weather} />
        </div>

        <div className="space-y-5">
          {/* 5-DAY FORECAST */}
          <DailyForecast forecast={weather?.forecast} />
        </div>
      </div>

      {/* 8. WEATHER ALERTS (CONDITIONAL) */}
      <WeatherAlerts weather={weather} cropName={cropName} />

      {/* 9. WEATHER -> IRRIGATION CONNECTION BRIDGE */}
      <WeatherIrrigationBridge weather={weather} cropName={cropName} />

    </div>
  );
};

export default Weather;
