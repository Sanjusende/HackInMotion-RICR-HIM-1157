import React, { useState, useEffect } from 'react';
import { getMarketCurrent, getMarketHistory } from '../services/marketService';
import { useFarm } from '../context/FarmContext';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Mic, DollarSign, RefreshCw, Info, Building2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Potato', 'Mustard', 'Sugarcane', 'Gram/Chickpea'];

const MarketIntelligence = () => {
  const { farm } = useFarm();
  const [selectedCrop, setSelectedCrop] = useState(farm?.currentCrop || 'Wheat');
  const [period, setPeriod] = useState('7d');
  const [marketData, setMarketData] = useState(null);
  const [historySeries, setHistorySeries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarket = async (crop, tabPeriod) => {
    try {
      setLoading(true);
      const res = await getMarketCurrent(crop);
      if (res.success) {
        setMarketData(res.data);
      }
      const histRes = await getMarketHistory(crop, tabPeriod);
      if (histRes.success) {
        setHistorySeries(histRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarket(selectedCrop, period);
  }, [selectedCrop, period]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            Market Intelligence
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real Mandi Prices & Non-Predictive Trend Analysis • Agmarknet Data
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold shadow-sm focus:ring-2 focus:ring-emerald-500"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <Link
            to="/voice-assistant"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-2 text-sm shadow-md"
          >
            <Mic className="w-4 h-4" />
            Ask SmartFarm
          </Link>
        </div>
      </div>

      {/* Hero Price Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between text-xs text-emerald-200 font-bold uppercase tracking-wider">
          <span>{marketData?.market || 'Indore Mandi'} • {marketData?.crop} Benchmark</span>
          <span>Source: Agmarknet / data.gov.in</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">₹{marketData?.currentPrice}</span>
              <span className="text-lg text-emerald-200 font-semibold">/ Quintal</span>
            </div>
            <p className="text-xs text-emerald-100 mt-1">Updated today ({marketData?.date})</p>
          </div>

          <div className={`px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm ${
            marketData?.trend === 'Rising' ? 'bg-emerald-400 text-slate-950' :
            marketData?.trend === 'Falling' ? 'bg-red-400 text-slate-950' : 'bg-slate-200 text-slate-900'
          }`}>
            {marketData?.trend === 'Rising' && <TrendingUp className="w-5 h-5" />}
            {marketData?.trend === 'Falling' && <TrendingDown className="w-5 h-5" />}
            {marketData?.trend === 'Stable' && <Minus className="w-5 h-5" />}
            <span>{marketData?.trend} ({marketData?.changePercent > 0 ? `+${marketData?.changePercent}%` : `${marketData?.changePercent}%`})</span>
          </div>
        </div>
      </div>

      {/* Recharts Historical Price Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Price Trend Chart</h2>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setPeriod('7d')}
              className={`px-3 py-1.5 rounded-lg transition ${period === '7d' ? 'bg-white text-emerald-700 shadow-sm font-bold' : ''}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-3 py-1.5 rounded-lg transition ${period === '30d' ? 'bg-white text-emerald-700 shadow-sm font-bold' : ''}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setPeriod('90d')}
              className={`px-3 py-1.5 rounded-lg transition ${period === '90d' ? 'bg-white text-emerald-700 shadow-sm font-bold' : ''}`}
            >
              90 Days
            </button>
          </div>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                formatter={(value) => [`₹${value} / Quintal`, 'Price']}
              />
              <Line type="monotone" dataKey="price" stroke="#059669" strokeWidth={3} dot={{ r: 3, fill: '#059669' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selling Decision Support Card (Non-Predictive Constraint) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600" />
          Selling Decision Support
        </h3>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-700 space-y-2">
          <p className="font-semibold text-slate-900">{marketData?.displayText}</p>
          <p className="text-xs text-slate-600">{marketData?.sellingInsightText}</p>
        </div>
      </div>

      {/* Nearby Markets Comparison */}
      {marketData?.nearbyMarkets && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-600" />
            Nearby Mandi Comparison
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {marketData.nearbyMarkets.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-1">
                <span className="font-bold text-slate-900 text-sm block">{item.market}</span>
                <p className="text-slate-500">{item.distanceKm > 0 ? `${item.distanceKm} km away` : 'Primary Location'}</p>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-black text-emerald-700">₹{item.price}</span>
                  <span className="text-slate-400">/ Quintal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;
