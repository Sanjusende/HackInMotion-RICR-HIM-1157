import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Droplets, Gauge } from 'lucide-react';

const DEFAULT_WATER_SERIES = [
  { day: 'Mon', actual: 1100, recommended: 1000 },
  { day: 'Tue', actual: 1200, recommended: 1100 },
  { day: 'Wed', actual: 950, recommended: 1000 },
  { day: 'Thu', actual: 1050, recommended: 1000 },
  { day: 'Fri', actual: 1150, recommended: 1050 },
  { day: 'Sat', actual: 1000, recommended: 1000 },
  { day: 'Sun', actual: 1200, recommended: 1200 }
];

const DEFAULT_MOISTURE_SERIES = [
  { day: 'Mon', current: 38, recommended: 45 },
  { day: 'Tue', current: 40, recommended: 45 },
  { day: 'Wed', current: 39, recommended: 45 },
  { day: 'Thu', current: 41, recommended: 45 },
  { day: 'Fri', current: 43, recommended: 45 },
  { day: 'Sat', current: 42, recommended: 45 },
  { day: 'Sun', current: 38, recommended: 45 }
];

const WaterUsageCharts = ({ calculatedTodayLiters }) => {
  const todayVal = calculatedTodayLiters || 1200;
  const weekVal = Math.round(todayVal * 6.5);
  const monthVal = Math.round(todayVal * 23.7);

  return (
    <div className="space-y-4">
      {/* 3 COMPACT WATER SUMMARY METRICS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Droplets size={14} className="text-blue-600" />
            Water Consumption Summary
          </h2>
          <span className="text-[11px] font-bold text-slate-400">Recorded Liters</span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today</span>
            <span className="text-lg sm:text-xl font-black text-slate-900">{todayVal.toLocaleString()} L</span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">This Week</span>
            <span className="text-lg sm:text-xl font-black text-slate-900">{weekVal.toLocaleString()} L</span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">This Month</span>
            <span className="text-lg sm:text-xl font-black text-slate-900">{monthVal.toLocaleString()} L</span>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WATER USAGE LINE CHART */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Water Usage (7 Days)</h3>
            <span className="text-[11px] font-semibold text-slate-400">Liters</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={DEFAULT_WATER_SERIES} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '11px' }}
                  formatter={(val, name) => [`${val} L`, name === 'actual' ? 'Actual Water' : 'Recommended']}
                />
                <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={2.5} dot={{ r: 3, fill: '#059669' }} />
                <Line type="monotone" dataKey="recommended" stroke="#0284c7" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SOIL MOISTURE AREA CHART */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Soil Moisture Trend</h3>
            <span className="text-[11px] font-semibold text-slate-400">Moisture (%)</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEFAULT_MOISTURE_SERIES} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[30, 60]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '11px' }}
                  formatter={(val) => [`${val}%`, 'Moisture']}
                />
                <Area type="monotone" dataKey="current" stroke="#059669" fill="url(#moistureGradient)" strokeWidth={2} />
                <Line type="monotone" dataKey="recommended" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterUsageCharts;
