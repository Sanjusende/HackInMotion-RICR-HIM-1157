import React from 'react';
import { Sprout, Layers, Check } from 'lucide-react';

const FieldSelector = ({ fields, selectedFieldId, onSelectField }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Layers size={14} className="text-emerald-600" />
          My Fields
        </h2>
        <span className="text-[11px] font-bold text-slate-400">Select Field to View Advice</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {fields.map((field) => {
          const isSelected = field.id === selectedFieldId;
          const isNeedsWater = field.soilMoisture < 45;

          return (
            <div
              key={field.id}
              onClick={() => onSelectField(field)}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer relative space-y-2.5 ${
                isSelected
                  ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                  : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/80'
              }`}
            >
              {isSelected && (
                <span className="absolute top-3 right-3 p-1 bg-emerald-600 text-white rounded-full">
                  <Check size={12} />
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xl">{field.icon || '🌾'}</span>
                <div>
                  <span className="text-xs font-black text-slate-900 block">{field.name}</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {field.crop} • {field.area} Acres
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500">
                  Soil Moisture: <strong className="text-slate-900">{field.soilMoisture}%</strong>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    isNeedsWater ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  {isNeedsWater ? '🟡 Needs Water' : '🟢 Optimal'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FieldSelector;
