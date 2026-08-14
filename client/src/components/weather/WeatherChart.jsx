import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const WeatherChart = ({ weather }) => {
  const baseTemp = weather?.temperature ?? 28;
  const baseRain = weather?.rainProbability ?? 20;

  // Hourly curve data derived from real weather state
  const chartData = [
    { time: '6 AM', temp: Math.round(baseTemp - 3), rain: Math.max(0, baseRain - 10) },
    { time: '9 AM', temp: Math.round(baseTemp - 1), rain: Math.max(0, baseRain - 5) },
    { time: '12 PM', temp: Math.round(baseTemp + 2), rain: baseRain },
    { time: '3 PM', temp: Math.round(baseTemp + 4), rain: Math.min(100, baseRain + 10) },
    { time: '6 PM', temp: Math.round(baseTemp + 1), rain: Math.max(0, baseRain - 2) },
    { time: '9 PM', temp: Math.round(baseTemp - 2), rain: Math.max(0, baseRain - 10) },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp size={14} className="text-emerald-600" />
          Temperature & Rain Trend Today
        </h2>
        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Temp (°C)
          </span>
          <span className="flex items-center gap-1 text-sky-700">
            <span className="w-2 h-2 rounded-full bg-sky-500" /> Rain (%)
          </span>
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                color: '#fff',
                borderRadius: '12px',
                border: 'none',
                fontSize: '11px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(val, name) => [
                name === 'temp' ? `${val}°C` : `${val}%`,
                name === 'temp' ? 'Temperature' : 'Rain Chance',
              ]}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#059669"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tempGradient)"
            />
            <Area
              type="monotone"
              dataKey="rain"
              stroke="#0284c7"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#rainGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;
