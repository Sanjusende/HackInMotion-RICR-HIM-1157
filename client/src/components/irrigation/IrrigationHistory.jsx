import React from 'react';
import { History, CheckCircle2, Droplets, Clock } from 'lucide-react';

const IrrigationHistory = ({ history, cropName }) => {
  const displayItems =
    history && history.length > 0
      ? history.slice(0, 6)
      : [
          {
            date: new Date('2026-08-14'),
            waterVol: '1,200 L',
            duration: '45 min',
            status: 'Completed',
            crop: cropName || 'Wheat',
          },
          {
            date: new Date('2026-08-13'),
            waterVol: '800 L',
            duration: '30 min',
            status: 'Completed',
            crop: 'Soybean',
          },
          {
            date: new Date('2026-08-12'),
            waterVol: '1,100 L',
            duration: '40 min',
            status: 'Completed',
            crop: cropName || 'Wheat',
          },
          {
            date: new Date('2026-08-10'),
            waterVol: '950 L',
            duration: '35 min',
            status: 'Completed',
            crop: 'Rice',
          },
        ];

  const formatDate = (d) => {
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return String(d);
      return dt.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return String(d);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <History size={14} className="text-emerald-600" />
          Irrigation History
        </h2>
        <span className="text-[11px] font-bold text-slate-400">Past Field Events</span>
      </div>

      {/* DESKTOP TABLE VIEW (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="pb-2.5">Date</th>
              <th className="pb-2.5">Crop / Field</th>
              <th className="pb-2.5">Water Volume</th>
              <th className="pb-2.5">Duration</th>
              <th className="pb-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
            {displayItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 font-bold text-slate-900">{formatDate(item.date)}</td>
                <td className="py-3 text-slate-700">{item.crop || cropName || 'Wheat'} Field</td>
                <td className="py-3 text-emerald-800 font-extrabold flex items-center gap-1">
                  <Droplets size={13} className="text-blue-500" />
                  {item.waterVol || '1,000 L'}
                </td>
                <td className="py-3 text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    {item.duration || '35 min'}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 font-extrabold rounded-md border border-emerald-200 text-[11px]">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    {item.status || 'Completed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW (< md) */}
      <div className="md:hidden space-y-2.5">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">{formatDate(item.date)}</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold rounded border border-emerald-200 text-[10px] flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-600" />
                {item.status || 'Completed'}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/50">
              <span className="font-semibold">{item.crop || cropName || 'Wheat'} Field</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Droplets size={12} className="text-blue-500" />
                {item.waterVol || '1,000 L'} ({item.duration || '35 min'})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IrrigationHistory;
