import React, { useEffect, useState } from 'react';
import { analyzeIrrigation, getIrrigationHistory } from '../services/irrigationService';
import { getCurrentWeather } from '../services/weatherService';
import { useFarm } from '../context/FarmContext';
import { AlertTriangle, RefreshCw, X, FileText, CheckCircle2, Droplets, Clock } from 'lucide-react';

import IrrigationHeader from '../components/irrigation/IrrigationHeader';
import IrrigationStatus from '../components/irrigation/IrrigationStatus';
import FieldSelector from '../components/irrigation/FieldSelector';
import SoilMoistureVisualizer from '../components/irrigation/SoilMoistureVisualizer';
import SmartRecommendation from '../components/irrigation/SmartRecommendation';
import WaterUsageCharts from '../components/irrigation/WaterUsageCharts';
import WaterEfficiencyCard from '../components/irrigation/WaterEfficiencyCard';
import IrrigationHistory from '../components/irrigation/IrrigationHistory';
import IrrigationAnalysisForm from '../components/irrigation/IrrigationAnalysisForm';

const Irrigation = () => {
  const { farm } = useFarm();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Field selector state
  const [fields, setFields] = useState([
    { id: 'f1', name: 'Field 01', crop: 'Wheat', area: 12, soilMoisture: 38, icon: '🌾' },
    { id: 'f2', name: 'Field 02', crop: 'Soybean', area: 8, soilMoisture: 61, icon: '🌱' },
    { id: 'f3', name: 'Field 03', crop: 'Rice', area: 10, soilMoisture: 72, icon: '🌾' }
  ]);
  const [selectedFieldId, setSelectedFieldId] = useState('f1');

  // Form State
  const [crop, setCrop] = useState('Wheat');
  const [landArea, setLandArea] = useState(12);
  const [soilType, setSoilType] = useState('Black Soil');
  const [soilMoisture, setSoilMoisture] = useState(38);

  useEffect(() => {
    if (farm) {
      if (farm.currentCrop) {
        setCrop(farm.currentCrop);
        setFields(prev => prev.map(f => f.id === 'f1' ? { ...f, crop: farm.currentCrop } : f));
      }
      if (farm.landSize?.value) {
        setLandArea(farm.landSize.value);
        setFields(prev => prev.map(f => f.id === 'f1' ? { ...f, area: farm.landSize.value } : f));
      }
      if (farm.soilType) setSoilType(farm.soilType);
    }
  }, [farm]);

  const selectedField = fields.find(f => f.id === selectedFieldId) || fields[0];

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
      }
    } catch (err) {
      console.error('Irrigation load error:', err);
      setError('Unable to calculate the latest irrigation recommendation. Please retry.');
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
    // Update active field values
    setFields(prev => prev.map(f => f.id === selectedFieldId ? {
      ...f,
      crop,
      area: landArea,
      soilMoisture
    } : f));

    await fetchIrrigationData();
  };

  const handleSelectField = (field) => {
    setSelectedFieldId(field.id);
    setCrop(field.crop);
    setLandArea(field.area);
    setSoilMoisture(field.soilMoisture);
  };

  // Water volume heuristic based on selected field area & moisture deficit
  const calculatedLiters = Math.round((selectedField.area || 10) * 100 * (selectedField.soilMoisture < 45 ? 1.0 : 0.4));
  const isIrrigateNeeded = selectedField.soilMoisture < 45;

  // Skeleton Loader State
  if (loading && !analyzing) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="h-20 bg-slate-200/80 rounded-2xl animate-pulse" />
        <div className="h-44 bg-slate-200/80 rounded-2xl animate-pulse" />
        <div className="h-36 bg-slate-200/80 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-56 bg-slate-200/80 rounded-3xl animate-pulse" />
          <div className="h-56 bg-slate-200/80 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  // Error State Component
  if (error && !result) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-black text-slate-900">Irrigation Data Unavailable</h2>
          <p className="text-xs text-slate-500 font-medium">{error}</p>
        </div>
        <button
          onClick={handleAnalyze}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-2 mx-auto shadow-xs"
        >
          <RefreshCw size={14} />
          <span>Retry Analysis</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-slate-900 selection:bg-emerald-600 selection:text-white">
      
      {/* 1. PAGE HEADER */}
      <IrrigationHeader
        analyzing={analyzing}
        onRefresh={handleAnalyze}
      />

      {/* 10. IRRIGATION STATUS BANNER */}
      <IrrigationStatus
        selectedField={selectedField}
        isIrrigateNeeded={isIrrigateNeeded}
        calculatedLiters={calculatedLiters}
      />

      {/* 11. FIELD SELECTOR */}
      <FieldSelector
        fields={fields}
        selectedFieldId={selectedFieldId}
        onSelectField={handleSelectField}
      />

      {/* 12 & 13. SOIL MOISTURE & SMART RECOMMENDATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* SOIL MOISTURE VISUALIZER */}
        <SoilMoistureVisualizer moisture={selectedField.soilMoisture} />

        {/* SMART RECOMMENDATION HERO CARD */}
        <SmartRecommendation
          result={result}
          farm={farm}
          selectedField={selectedField}
          calculatedLiters={calculatedLiters}
          onOpenPlan={() => setShowPlanModal(true)}
        />
      </div>

      {/* 14 & 16. WATER USAGE & WATER EFFICIENCY */}
      <WaterUsageCharts calculatedTodayLiters={calculatedLiters} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* WATER EFFICIENCY INSIGHT */}
        <WaterEfficiencyCard
          usedLiters={calculatedLiters}
          recommendedLiters={Math.round(calculatedLiters * 1.2)}
        />

        {/* ANALYSIS FORM CALCULATOR */}
        <IrrigationAnalysisForm
          crop={crop}
          setCrop={setCrop}
          landArea={landArea}
          setLandArea={setLandArea}
          soilType={soilType}
          setSoilType={setSoilType}
          soilMoisture={soilMoisture}
          setSoilMoisture={setSoilMoisture}
          analyzing={analyzing}
          onAnalyze={handleAnalyze}
        />
      </div>

      {/* 15. IRRIGATION HISTORY */}
      <IrrigationHistory
        history={history}
        cropName={selectedField.crop}
      />

      {/* IRRIGATION PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-large border border-slate-200 space-y-4 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowPlanModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Irrigation Action Plan</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedField.name} • {selectedField.crop}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700 font-medium leading-relaxed">
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-extrabold text-emerald-950 block flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Recommended Time
                </span>
                <p className="text-slate-700">Tomorrow early morning: <strong>6:00 AM – 8:00 AM</strong></p>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 space-y-1">
                <span className="font-extrabold text-blue-950 block flex items-center gap-1">
                  <Droplets size={14} className="text-blue-600" />
                  Total Water Target
                </span>
                <p className="text-slate-700">Apply approximately <strong>{calculatedLiters.toLocaleString()} Liters</strong> across your {selectedField.area} Acres.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-extrabold text-slate-900 block flex items-center gap-1">
                  <Clock size={14} className="text-slate-500" />
                  Pumping Schedule
                </span>
                <p className="text-slate-600">Operate 5 HP pump for <strong>40 minutes</strong> to ensure deep root penetration without surface run-off.</p>
              </div>
            </div>

            <button
              onClick={() => setShowPlanModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Done / Close Plan
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Irrigation;
