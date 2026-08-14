import React from 'react';
import { AlertTriangle, CloudRain, Flame, Wind, Snowflake, Info } from 'lucide-react';

const WeatherAlerts = ({ weather, cropName }) => {
  const rainProb = weather?.rainProbability ?? 20;
  const rainfallMm = weather?.rainfallMm ?? 0;
  const temp = weather?.temperature ?? 28;
  const windSpeed = weather?.windSpeed ?? 12;

  const alerts = [];

  // Heavy Rain Alert
  if (rainfallMm >= 25 || (rainProb >= 75 && rainfallMm >= 15)) {
    alerts.push({
      type: 'Heavy Rain Expected',
      level: 'Critical',
      icon: <CloudRain className="w-5 h-5 text-rose-600 shrink-0" />,
      color: 'bg-rose-50 border-rose-200 text-rose-950',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: `Heavy rainfall (~${rainfallMm}mm) is expected today/tomorrow. Clear farm field drainage channels to prevent root waterlogging.`
    });
  }

  // High Temperature Alert
  if (temp >= 38) {
    alerts.push({
      type: 'High Temperature Warning',
      level: 'Warning',
      icon: <Flame className="w-5 h-5 text-amber-600 shrink-0" />,
      color: 'bg-amber-50 border-amber-200 text-amber-950',
      badgeColor: 'bg-amber-100 text-amber-900',
      desc: `High ambient temperature (${temp}°C) detected. Irrigate early morning to cushion your ${cropName || 'crop'} root zone against heat stress.`
    });
  }

  // Strong Wind Alert
  if (windSpeed >= 20) {
    alerts.push({
      type: 'Strong Wind Warning',
      level: 'Info',
      icon: <Wind className="w-5 h-5 text-sky-600 shrink-0" />,
      color: 'bg-sky-50 border-sky-200 text-sky-950',
      badgeColor: 'bg-sky-100 text-sky-900',
      desc: `Gusty wind speeds of ${windSpeed} km/h recorded. Postpone foliar sprays and secure temporary greenhouse structures.`
    });
  }

  // Frost Alert
  if (temp <= 4) {
    alerts.push({
      type: 'Frost Alert',
      level: 'Critical',
      icon: <Snowflake className="w-5 h-5 text-indigo-600 shrink-0" />,
      color: 'bg-indigo-50 border-indigo-200 text-indigo-950',
      badgeColor: 'bg-indigo-100 text-indigo-900',
      desc: `Frost threat detected tonight (${temp}°C). Provide light smoke or protective covers for sensitive standing crops.`
    });
  }

  // Only render if relevant alerts exist
  if (alerts.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Weather Alerts
        </h2>
        <span className="text-[11px] font-bold text-slate-400">{alerts.length} Active Notice(s)</span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all ${alert.color}`}
          >
            <div className="mt-0.5">{alert.icon}</div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">{alert.type}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${alert.badgeColor}`}>
                  {alert.level}
                </span>
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-90">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;
