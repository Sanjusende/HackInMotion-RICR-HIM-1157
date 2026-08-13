import React, { useEffect, useState } from 'react';
import { analyzeIrrigation, getIrrigationHistory } from '../services/irrigationService';
import { useFarm } from '../context/FarmContext';
import { Link } from 'react-router-dom';
import { Droplets, Info, History, Mic, RefreshCw, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const Irrigation = () => {
  const { farm } = useFarm();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchIrrigationData = async () => {
    try {
      setLoading(true);
      const res = await analyzeIrrigation(farm?._id);
      if (res.success) {
        setResult(res.data);
      }
      const histRes = await getIrrigationHistory();
      if (histRes.success) {
        setHistory(histRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchIrrigationData();
  }, []);

  const handleReevaluate = () => {
    setAnalyzing(true);
    fetchIrrigationData();
  };

  if (loading && !analyzing) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="h-10 bg-slate-200 rounded-lg w-48 animate-pulse"></div>
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  const decision = result?.decision;
  const reasoning = result?.reasoning;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Droplets className="w-8 h-8 text-blue-600" />
            Smart Irrigation Advisory
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            🌱 {farm?.currentCrop || 'Wheat'} ({farm?.growthStage || 'Vegetative'}) • {farm?.location?.display || 'Indore, MP'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleReevaluate} disabled={analyzing} variant="secondary" className="flex items-center gap-2 text-sm">
            <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            Re-evaluate
          </Button>
          <Link
            to="/voice-assistant"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-2 text-sm shadow-md"
          >
            <Mic className="w-4 h-4" />
            Ask Voice Assistant
          </Link>
        </div>
      </div>

      {/* Main Decision Card */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-lg space-y-6 ${
        decision === 'DONT_IRRIGATE' ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400' :
        decision === 'IRRIGATE' ? 'bg-gradient-to-br from-blue-600 to-cyan-700 text-white border-blue-400' :
        'bg-gradient-to-br from-slate-600 to-slate-800 text-white border-slate-500'
      }`}>
        <div className="flex items-center gap-4">
          {decision === 'DONT_IRRIGATE' && <AlertCircle className="w-12 h-12 text-amber-100 shrink-0" />}
          {decision === 'IRRIGATE' && <CheckCircle className="w-12 h-12 text-blue-100 shrink-0" />}
          {decision === 'NEED_MORE_INFO' && <HelpCircle className="w-12 h-12 text-slate-200 shrink-0" />}

          <div>
            <span className="text-xs uppercase tracking-wider font-bold opacity-80">TODAY'S ADVISORY VERDICT</span>
            <h2 className="text-3xl font-black mt-1">
              {decision === 'DONT_IRRIGATE' && 'DON\'T IRRIGATE TODAY'}
              {decision === 'IRRIGATE' && 'IRRIGATE YOUR FIELD TODAY'}
              {decision === 'NEED_MORE_INFO' && 'NEED MORE INFORMATION'}
            </h2>
          </div>
        </div>

        <p className="text-base sm:text-lg font-medium leading-relaxed bg-black/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
          {reasoning?.actionableAdvice}
        </p>

        {/* Input Transparency Breakdown */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-3">
          <span className="text-xs uppercase tracking-wider font-bold block opacity-90">INPUT TRANSPARENCY & THRESHOLDS</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="block opacity-75">Rain Probability</span>
              <span className="text-base font-extrabold">{reasoning?.rainProbability}%</span>
            </div>
            <div>
              <span className="block opacity-75">Expected Rainfall</span>
              <span className="text-base font-extrabold">{reasoning?.expectedRainfallMm} mm</span>
            </div>
            <div>
              <span className="block opacity-75">Crop Water Need</span>
              <span className="text-base font-extrabold">{reasoning?.cropWaterNeedMm} mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision History */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-600" />
            Previous Irrigation History
          </h3>

          <div className="divide-y divide-slate-100">
            {history.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">{new Date(item.date).toLocaleDateString()}</span>
                  <p className="text-slate-500">{item.reasoning?.summaryText}</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  item.decision === 'DONT_IRRIGATE' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.decision}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Irrigation;
