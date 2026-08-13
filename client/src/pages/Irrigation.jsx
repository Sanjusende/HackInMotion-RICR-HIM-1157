import React, { useEffect, useState } from 'react';
import { analyzeIrrigation, getIrrigationHistory } from '../services/irrigationService';
import { getCurrentWeather } from '../services/weatherService';
import { useFarm } from '../context/FarmContext';
import {
  Droplets,
  CloudRain,
  Sprout,
  Clock,
  Gauge,
  Leaf,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Sliders,
  TrendingDown,
  TrendingUp,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Potato', 'Mustard'];
const SOIL_TYPES = ['Black Soil', 'Alluvial Soil', 'Red Soil', 'Clay Soil', 'Loamy Soil'];

// Fallback / historical week series for water usage chart
const DEFAULT_WATER_SERIES = [
  { day: 'Mon', actual: 1100, recommended: 1000 },
  { day: 'Tue', actual: 1200, recommended: 1100 },
  { day: 'Wed', actual: 950, recommended: 1000 },
  { day: 'Thu', actual: 1050, recommended: 1000 },
  { day: 'Fri', actual: 1150, recommended: 1050 },
  { day: 'Sat', actual: 1000, recommended: 1000 },
  { day: 'Sun', actual: 1000, recommended: 1000 }
];

const DEFAULT_MOISTURE_SERIES = [
  { day: 'Mon', current: 38, recommended: 45 },
  { day: 'Tue', current: 40, recommended: 45 },
  { day: 'Wed', current: 39, recommended: 45 },
  { day: 'Thu', current: 41, recommended: 45 },
  { day: 'Fri', current: 43, recommended: 45 },
  { day: 'Sat', current: 42, recommended: 45 },
  { day: 'Sun', current: 42, recommended: 45 }
];

const Irrigation = () => {
  const { farm } = useFarm();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [crop, setCrop] = useState('Wheat');
  const [landArea, setLandArea] = useState(5);
  const [soilType, setSoilType] = useState('Black Soil');
  const [soilMoisture, setSoilMoisture] = useState(42);
  const [rainForecast, setRainForecast] = useState(20);

  useEffect(() => {
    if (farm) {
      if (farm.currentCrop) setCrop(farm.currentCrop);
      if (farm.landSize?.value) setLandArea(farm.landSize.value);
      if (farm.soilType) setSoilType(farm.soilType);
    }
  }, [farm]);

  const fetchIrrigationData = async () => {
    try {
      setError(null);
      const res = await analyzeIrrigation(farm?._id);
      if (res && res.success) {
        setResult(res.data);
      }
      const histRes = await getIrrigationHistory();
      if (histRes && histRes.success) {
        setHistory(histRes.data || []);
      }
      const weatherRes = await getCurrentWeather();
      if (weatherRes && weatherRes.success) {
        setWeather(weatherRes.data);
        if (weatherRes.data?.rainProbability !== undefined) {
          setRainForecast(weatherRes.data.rainProbability);
        }
      }
    } catch (err) {
      console.error('Irrigation load error:', err);
      setError('Unable to load irrigation data');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchIrrigationData();
  }, []);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setAnalyzing(true);
    await fetchIrrigationData();
  };

  // Skeleton Loader State
  if (loading && !analyzing) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-7 bg-slate-200 rounded-lg w-40 animate-pulse" />
          <div className="h-7 bg-slate-200 rounded-lg w-24 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-44 bg-slate-200 rounded-xl animate-pulse" />
        </div>
        <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  // Error State Component
  if (error && !result) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl border border-slate-200 shadow-xs text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <p className="text-sm font-bold text-slate-900">{error}</p>
        <p className="text-xs text-slate-500">Please check network connection and try again.</p>
        <button
          onClick={handleAnalyze}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const decision = result?.decision || 'DONT_IRRIGATE';
  const isIrrigate = decision === 'IRRIGATE';
  const confidence = result?.confidence ? Math.round(result.confidence * 100) : 92;
  const currentTemp = weather?.temperature || 28;
  const currentRainProb = weather?.rainProbability ?? rainForecast;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* 1. PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Irrigation</h1>
            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Active
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Smart water planning for your farm.</p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition flex items-center gap-1.5 text-xs font-semibold border border-slate-200 cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${analyzing ? 'animate-spin' : ''}`} />
          <span>{analyzing ? 'Analyzing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* 2. TOP 4 KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">Water Need</span>
            <Droplets className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">24 <span className="text-xs font-bold text-slate-500">L/m²</span></p>
          <p className="text-[10px] font-semibold text-slate-400">Optimal soil depth</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">Soil Moisture</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{soilMoisture}%</p>
          <p className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
            <TrendingUp size={10} /> Moderate range
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">Rain Chance</span>
            <CloudRain className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">{currentRainProb}%</p>
          <p className="text-[10px] font-semibold text-slate-400">Low rainfall likelihood</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold">Next Irrigation</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900">6:00 AM</p>
          <p className="text-[10px] font-semibold text-slate-400">{isIrrigate ? 'Scheduled Today' : 'Tomorrow morning'}</p>
        </div>
      </div>

      {/* 3 & 7. IRRIGATION STATUS & SMARTAG AI RECOMMENDATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* IRRIGATION STATUS */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-emerald-200 transition flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Irrigation Status</h2>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border flex items-center gap-1.5 ${
              isIrrigate
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isIrrigate ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              {isIrrigate ? 'Recommended' : 'Monitor'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Water</span>
              <span className="text-base font-black text-slate-900">24 L/m²</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Next</span>
              <span className="text-xs font-bold text-slate-800 block">Tomorrow, 6:00 AM</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Duration</span>
              <span className="text-xs font-bold text-slate-800 block">35 min</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500">
              <span>Moisture Target</span>
              <span className="text-emerald-700 font-bold">85% Optimal</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* SMARTAG AI RECOMMENDATION */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-emerald-200 transition flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>SmartAg AI</span>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Confidence {confidence}%
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-900 block">
              {result?.reasoning?.actionableAdvice || 'Irrigate tomorrow morning.'}
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Reason: Soil moisture is moderate and rainfall probability is low ({currentRainProb}%).
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 block">Water</span>
              <span className="text-xs font-black text-slate-900">24 L/m²</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 block">Time</span>
              <span className="text-xs font-black text-slate-900">6 AM</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 block">Confidence</span>
              <span className="text-xs font-black text-emerald-700">{confidence}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4 & 5. WATER USAGE & SOIL MOISTURE TREND CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* WATER USAGE CHART */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Water Usage</h2>
            <span className="text-[11px] font-semibold text-slate-400">Last 7 Days (Liters)</span>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEFAULT_WATER_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '11px' }}
                  formatter={(val, name) => [`${val} L`, name === 'actual' ? 'Actual Water' : 'Recommended']}
                />
                <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2.5} dot={{ r: 3, fill: '#059669' }} />
                <Line type="monotone" dataKey="recommended" stroke="#0284c7" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SOIL MOISTURE TREND CHART */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Soil Moisture</h2>
            <span className="text-[11px] font-semibold text-slate-400">7-Day Trend (%)</span>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEFAULT_MOISTURE_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[30, 60]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '11px' }}
                  formatter={(val) => [`${val}%`, 'Moisture']}
                />
                <Area type="monotone" dataKey="current" stroke="#059669" fill="#10b98120" strokeWidth={2} />
                <Line type="monotone" dataKey="recommended" stroke="#64748b" strokeDasharray="3 3" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 6. FARM CONDITIONS (4 SMALL CARDS) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Farm Conditions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <Gauge className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Soil</span>
              <span className="text-base font-extrabold text-slate-900">{soilMoisture}%</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Crop</span>
              <span className="text-base font-extrabold text-slate-900">{crop}</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <CloudRain className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Rain</span>
              <span className="text-base font-extrabold text-slate-900">{currentRainProb}%</span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <Thermometer className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Temp</span>
              <span className="text-base font-extrabold text-slate-900">{currentTemp}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9 & 8. ANALYSIS FORM & WATER EFFICIENCY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* ANALYSIS FORM */}
        <form onSubmit={handleAnalyze} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-emerald-200 transition">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Analyze Irrigation</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Crop</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              >
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Area (Acres)</label>
              <input
                type="number"
                min="1"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              >
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Soil Moisture (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Analyze</span>
              </>
            )}
          </button>
        </form>

        {/* WATER EFFICIENCY & WATER SAVING INSIGHT */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between hover:border-emerald-200 transition">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Water Efficiency</h2>
              <span className="text-base font-black text-emerald-700">82%</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1 py-3">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 block">Used</span>
                <span className="text-xs font-black text-slate-900">1,000 L</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 block">Recommended</span>
                <span className="text-xs font-black text-slate-900">1,200 L</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-500 block">Saved</span>
                <span className="text-xs font-black text-emerald-700">200 L</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900 flex items-center gap-1">
              💧 Water Saving:
            </span>
            <span className="font-extrabold text-emerald-700">Saved 200 L this week</span>
          </div>
        </div>

      </div>

      {/* 10. IRRIGATION HISTORY TABLE */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 hover:border-emerald-200 transition">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Irrigation History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold">
                <th className="pb-2">Date</th>
                <th className="pb-2">Water</th>
                <th className="pb-2">Duration</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {history.length > 0 ? (
                history.slice(0, 5).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5">{new Date(item.date).toLocaleDateString([], { day: '2-digit', month: 'short' })}</td>
                    <td className="py-2.5 font-bold text-slate-900">1000 L</td>
                    <td className="py-2.5 text-slate-600">35 min</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[11px]">
                        Done
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold">13 Aug</td>
                    <td className="py-2.5 text-slate-900 font-bold">1000 L</td>
                    <td className="py-2.5 text-slate-600">35 min</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[11px]">
                        Done
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold">12 Aug</td>
                    <td className="py-2.5 text-slate-900 font-bold">1200 L</td>
                    <td className="py-2.5 text-slate-600">40 min</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[11px]">
                        Done
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold">11 Aug</td>
                    <td className="py-2.5 text-slate-900 font-bold">1100 L</td>
                    <td className="py-2.5 text-slate-600">37 min</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded border border-emerald-200 text-[11px]">
                        Done
                      </span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Irrigation;
