import React, { useEffect, useState } from 'react';
import { getCurrentWeather } from '../services/weatherService';
import { useFarm } from '../context/FarmContext';
import { Link } from 'react-router-dom';
import { CloudRain, Thermometer, Wind, Droplets, Mic, AlertTriangle, RefreshCw, Calendar } from 'lucide-react';

const Weather = () => {
  const { farm } = useFarm();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const res = await getCurrentWeather();
      if (res.success) {
        setWeather(res.data);
      }
    } catch (err) {
      console.error(err);
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

  if (loading && !refreshing) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="h-10 bg-slate-200 rounded-lg w-48 animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Title & Voice Shortcut Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <CloudRain className="w-8 h-8 text-blue-600" />
            Weather Intelligence
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            📍 {farm?.location?.display || 'Indore, Madhya Pradesh'} • Live Weather & 7-Day Forecast
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-2 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/voice-assistant"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-2 text-sm shadow-md"
          >
            <Mic className="w-4 h-4" />
            Ask Voice Assistant
          </Link>
        </div>
      </div>

      {/* Current Conditions Hero Card */}
      <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-bold">CURRENT CONDITIONS</span>
            <div className="flex items-baseline gap-4 mt-2">
              <span className="text-5xl sm:text-6xl font-black">{weather?.temperature}°C</span>
              <span className="text-xl text-blue-100 font-semibold">{weather?.weatherCondition}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs space-y-2">
            <div className="flex items-center justify-between gap-6">
              <span className="text-blue-200">Rain Probability:</span>
              <span className="font-bold text-white">{weather?.rainProbability}%</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-blue-200">Expected Rainfall:</span>
              <span className="font-bold text-white">{weather?.rainfallMm} mm</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-blue-200">Humidity:</span>
              <span className="font-bold text-white">{weather?.humidity}%</span>
            </div>
          </div>
        </div>

        {/* Agricultural Weather Interpretation */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-sm text-blue-50 font-medium">
          💡 <strong>Farming Interpretation:</strong> {weather?.rainProbability >= 70
            ? `High rain probability (${weather?.rainProbability}%, ${weather?.rainfallMm}mm) expected. Pause irrigation and check field drainage.`
            : `Favorable dry weather for spraying and harvesting operations today.`}
        </div>
      </div>

      {/* 7-Day Forecast Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          7-Day Agricultural Forecast
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {weather?.forecast?.slice(0, 6).map((day, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-2 hover:border-blue-200 transition">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{idx === 0 ? 'Today' : day.date}</span>
                <span className="text-blue-600">{day.condition}</span>
              </div>
              <div className="flex items-baseline justify-between py-1">
                <span className="text-2xl font-black text-slate-900">{day.tempMax}°C</span>
                <span className="text-sm font-semibold text-slate-400">/ {day.tempMin}°C</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-100">
                <span>🌧️ Rain: {day.rainProbability}%</span>
                <span className="font-bold text-blue-700">{day.rainfallMm} mm</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
