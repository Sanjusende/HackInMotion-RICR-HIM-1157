import React from 'react';
import { Sliders, Sparkles, RefreshCw } from 'lucide-react';

const CROPS = ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton', 'Potato', 'Mustard'];
const SOIL_TYPES = ['Black Soil', 'Alluvial Soil', 'Red Soil', 'Clay Soil', 'Loamy Soil'];

const IrrigationAnalysisForm = ({
  crop,
  setCrop,
  landArea,
  setLandArea,
  soilType,
  setSoilType,
  soilMoisture,
  setSoilMoisture,
  analyzing,
  onAnalyze,
}) => {
  return (
    <form
      onSubmit={onAnalyze}
      className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders size={14} className="text-emerald-600" />
          Field Analysis Calculator
        </h2>
        <span className="text-[11px] font-bold text-slate-400">Recalculate Water Needs</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Crop Type</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Land Area (Acres)
          </label>
          <input
            type="number"
            min="1"
            max="500"
            value={landArea}
            onChange={(e) => setLandArea(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">Soil Type</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {SOIL_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-700 block mb-1">
            Soil Moisture (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={analyzing}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {analyzing ? (
          <>
            <RefreshCw size={14} className="animate-spin" />
            <span>Analyzing Farm Parameters...</span>
          </>
        ) : (
          <>
            <Sparkles size={14} />
            <span>Recalculate Irrigation Recommendation</span>
          </>
        )}
      </button>
    </form>
  );
};

export default IrrigationAnalysisForm;
