import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sprout, Layers, Calendar, Compass, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const SOIL_TYPES = [
  'Black Soil',
  'Red Soil',
  'Alluvial Soil',
  'Clay Soil',
  'Sandy Soil',
  'Loamy Soil',
  'Unknown/Not sure'
];

const CROPS = [
  'Wheat',
  'Rice',
  'Maize',
  'Soybean',
  'Cotton',
  'Potato',
  'Mustard',
  'Sugarcane',
  'Gram/Chickpea',
  'Tomato',
  'Onion'
];

const GROWTH_STAGES = [
  'Initial / Germination',
  'Vegetative',
  'Flowering',
  'Yield Formation / Fruiting',
  'Ripening / Harvesting'
];

const SEASONS = ['Kharif', 'Rabi', 'Zaid'];

const FarmProfile = () => {
  const { farm, saveFarm, loading: farmLoading } = useFarm();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'My Farm',
    lat: '',
    lng: '',
    manualLocation: '',
    landSize: 5,
    landUnit: 'acres',
    soilType: 'Black Soil',
    currentCrop: 'Wheat',
    plannedCrop: '',
    growthStage: 'Vegetative',
    season: 'Kharif'
  });

  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name || 'My Farm',
        lat: farm.location?.lat || '',
        lng: farm.location?.lng || '',
        manualLocation: farm.location?.display || '',
        landSize: farm.landSize?.value || 5,
        landUnit: farm.landSize?.unit || 'acres',
        soilType: farm.soilType || 'Black Soil',
        currentCrop: farm.currentCrop || 'Wheat',
        plannedCrop: farm.plannedCrop || '',
        growthStage: farm.growthStage || 'Vegetative',
        season: farm.season || 'Kharif'
      });
      if (farm.location?.lat) setGpsDetected(true);
    }
  }, [farm]);

  const handleUseGps = () => {
    setDetectingGps(true);
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please enter location manually.');
      setDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          lat: latitude,
          lng: longitude
        }));
        setGpsDetected(true);
        setDetectingGps(false);
      },
      (error) => {
        console.warn('GPS position error:', error.message);
        setGpsError('Could not detect location automatically. Please use manual location input below.');
        setDetectingGps(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveFarm(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-emerald-950 flex items-center justify-center sm:justify-start gap-3">
          <Sprout className="w-8 h-8 text-emerald-600" />
          {farm ? 'Update Your Farm Profile' : 'Set Up Your Farm Profile'}
        </h1>
        <p className="text-slate-600 mt-2">
          Personalize SmartFarm with your location, soil, and crop details to get customized irrigation, weather risk, and market advice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Location Capture */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            1. Farm Location
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
              <Button
                type="button"
                variant="primary"
                onClick={handleUseGps}
                disabled={detectingGps}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm"
              >
                {detectingGps ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Detecting location...
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4" />
                    Use Current Location (GPS)
                  </>
                )}
              </Button>

              {gpsDetected && !detectingGps && (
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  GPS coordinates captured ({Number(formData.lat).toFixed(4)}, {Number(formData.lng).toFixed(4)})
                </div>
              )}
            </div>

            {gpsError && (
              <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                {gpsError}
              </p>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Or enter State / District / Village manually:
              </label>
              <input
                type="text"
                value={formData.manualLocation}
                onChange={(e) => setFormData({ ...formData, manualLocation: e.target.value })}
                placeholder="e.g. Indore, Madhya Pradesh"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Land & Soil Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            2. Land Size & Soil Type
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Land Size
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.landSize}
                  onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
                <select
                  value={formData.landUnit}
                  onChange={(e) => setFormData({ ...formData, landUnit: e.target.value })}
                  className="px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 text-slate-700 font-medium"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Soil Type
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-medium"
              >
                {SOIL_TYPES.map((soil) => (
                  <option key={soil} value={soil}>
                    {soil}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Crop & Growth Stage */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            3. Crop Details & Growth Stage
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Current Crop <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.currentCrop}
                onChange={(e) => setFormData({ ...formData, currentCrop: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-medium"
              >
                {CROPS.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Current Growth Stage
              </label>
              <select
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-medium"
              >
                {GROWTH_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Season
              </label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-medium"
              >
                {SEASONS.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Planned Next Crop (Optional)
              </label>
              <input
                type="text"
                value={formData.plannedCrop}
                onChange={(e) => setFormData({ ...formData, plannedCrop: e.target.value })}
                placeholder="e.g. Maize, Soybean"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Farm Profile...
              </>
            ) : (
              <>
                Save & Continue to Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FarmProfile;
