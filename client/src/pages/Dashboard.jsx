import React, { useEffect, useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { getDashboardSummary } from '../services/dashboardService';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplets,
  CloudRain,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Mic,
  Sprout,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const { farm, isProfileComplete } = useFarm();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardSummary();
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading && !refreshing) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="h-10 bg-slate-200 rounded-lg w-48 animate-pulse"></div>
        <div className="h-48 bg-slate-200 rounded-2xl w-full animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!isProfileComplete && !loading) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 bg-white rounded-3xl border border-emerald-100 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <Sprout className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Complete Your Farm Profile</h2>
        <p className="text-slate-600 max-w-md mx-auto">
          To receive personalized daily irrigation advice, weather risk alerts, and mandi market intelligence, please set up your farm location and crop details.
        </p>
        <Button onClick={() => navigate('/farm-profile')} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">
          Set Up Farm Profile
        </Button>
      </div>
    );
  }

  const { todaysAction, weatherAlert, cropHealth, market, communityAlert, fertilizerShortcut } = dashboardData || {};

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-teal-700 text-white p-6 rounded-3xl shadow-lg">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">SmartFarm Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Today's Farm Action
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            🌱 {farm?.currentCrop || 'Wheat'} • {farm?.landSize?.value || 5} {farm?.landSize?.unit || 'Acres'} • {farm?.location?.display || 'Indore, MP'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition text-white flex items-center gap-2 text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/voice-assistant"
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl transition flex items-center gap-2 shadow-md text-sm"
          >
            <Mic className="w-4 h-4" />
            Ask SmartFarm
          </Link>
        </div>
      </div>

      {/* Community Alert Bar if active */}
      {communityAlert?.active && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900">{communityAlert.title}</span>
              <span className="text-xs text-amber-700 font-medium">{communityAlert.distanceKm} km away • {communityAlert.reportsCount} reports</span>
            </div>
            <p className="text-amber-800 mt-1">{communityAlert.message}</p>
            <p className="text-amber-900 font-semibold mt-1">💡 {communityAlert.recommended}</p>
          </div>
        </div>
      )}

      {/* Visually Dominant Card 1: Today's Action (Irrigation Engine) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md hover:shadow-lg transition space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${todaysAction?.decision === 'DONT_IRRIGATE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              <Droplets className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase text-slate-400">IRRIGATION DECISION</span>
              <h2 className="text-2xl font-black text-slate-900">
                {todaysAction?.decision === 'DONT_IRRIGATE' && '🚫 DON\'T IRRIGATE TODAY'}
                {todaysAction?.decision === 'IRRIGATE' && '💧 IRRIGATE TODAY'}
                {todaysAction?.decision === 'NEED_MORE_INFO' && '❓ NEED MORE INFO'}
              </h2>
            </div>
          </div>
          <Link to="/irrigation" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            Details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-slate-700 text-base font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
          {todaysAction?.reasoning?.actionableAdvice || todaysAction?.reasoning?.summaryText || 'Weather conditions evaluated for optimal crop water balance.'}
        </p>

        {todaysAction?.reasoning && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-2">
            <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
              <span className="block text-slate-400 font-medium">Rain Chance</span>
              <span className="font-bold text-slate-800 text-sm">{todaysAction.reasoning.rainProbability}%</span>
            </div>
            <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
              <span className="block text-slate-400 font-medium">Expected Rain</span>
              <span className="font-bold text-slate-800 text-sm">{todaysAction.reasoning.expectedRainfallMm} mm</span>
            </div>
            <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 col-span-2 sm:col-span-1">
              <span className="block text-slate-400 font-medium">Crop Daily Need</span>
              <span className="font-bold text-slate-800 text-sm">{todaysAction.reasoning.cropWaterNeedMm} mm</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid Cards 2 & 3: Weather Alert & Market Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weather Intelligence Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <CloudRain className="w-5 h-5 text-blue-600" />
              Weather Risk Status
            </div>
            <Link to="/weather" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              View Forecast &rarr;
            </Link>
          </div>

          {weatherAlert?.hasRisk ? (
            <div className="space-y-2">
              {weatherAlert.risks.map((risk, idx) => (
                <div key={idx} className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-900 font-medium space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-red-700">
                    <AlertTriangle className="w-4 h-4" /> {risk.type} Alert ({risk.riskLevel})
                  </div>
                  <p>{risk.farmerMessage}</p>
                  <p className="font-semibold text-red-950">💡 {risk.recommendedAction}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl text-sm text-emerald-900 font-semibold flex items-center gap-3">
              <span className="text-xl">☀️</span>
              No extreme weather risk detected for your region today.
            </div>
          )}
        </div>

        {/* Compact Market Intelligence Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Market Intelligence ({market?.crop})
            </div>
            <Link to="/market" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              View Market Page &rarr;
            </Link>
          </div>

          {market ? (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-slate-900">₹{market.currentPrice}</span>
                  <span className="text-xs text-slate-500 font-medium ml-1">/ Quintal</span>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  market.trend === 'Rising' ? 'bg-emerald-100 text-emerald-800' :
                  market.trend === 'Falling' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {market.trend === 'Rising' && <TrendingUp className="w-3.5 h-3.5" />}
                  {market.trend === 'Falling' && <TrendingDown className="w-3.5 h-3.5" />}
                  {market.trend === 'Stable' && <Minus className="w-3.5 h-3.5" />}
                  {market.trend} ({market.changePercent > 0 ? `+${market.changePercent}%` : `${market.changePercent}%`})
                </div>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {market.displayText}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Market price data unavailable.</p>
          )}
        </div>
      </div>

      {/* Cards 4 & 5: Crop Health & Fertilizer Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crop Health Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Crop Health Observation
            </span>
            <Link to="/crop-health" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              Report Issue &rarr;
            </Link>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">
              {cropHealth?.possibleIssue || 'No recent crop issue reported.'}
            </span>
            <p>{cropHealth?.nextAction || 'Upload leaf photo to check for pest or disease symptoms.'}</p>
          </div>
        </div>

        {/* Fertilizer Shortcut Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" />
              Fertilizer & Growth Plan
            </span>
            <Link to="/fertilizer-planning" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
              View Plan &rarr;
            </Link>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 block text-sm">
              {fertilizerShortcut?.crop} ({fertilizerShortcut?.growthStage} Stage)
            </span>
            <p>{fertilizerShortcut?.summaryText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
