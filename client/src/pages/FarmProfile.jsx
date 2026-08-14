import React, { useState, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Sprout,
  Layers,
  Compass,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Edit3,
  AlertTriangle,
  RefreshCw,
  Check
} from 'lucide-react';
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
    locationName: '',
    fullAddress: '',
    manualLocation: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    landSize: 5,
    landUnit: 'acres',
    soilType: 'Black Soil',
    currentCrop: 'Wheat',
    plannedCrop: '',
    growthStage: 'Vegetative',
    season: 'Kharif'
  });

  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'detecting' | 'success' | 'permission_denied' | 'unavailable' | 'geocoding_failed'
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize profile data from existing farm record
  useEffect(() => {
    if (farm) {
      const savedLat = farm.location?.lat || '';
      const savedLng = farm.location?.lng || '';
      const savedName = farm.location?.name || farm.location?.display || (savedLat ? 'Farm Location' : '');
      const savedAddress = farm.location?.fullAddress || farm.location?.display || '';

      setFormData({
        name: farm.name || 'My Farm',
        lat: savedLat,
        lng: savedLng,
        locationName: savedName,
        fullAddress: savedAddress,
        manualLocation: farm.location?.display || '',
        address: farm.location?.address || '',
        city: farm.location?.city || '',
        district: farm.location?.district || '',
        state: farm.location?.state || '',
        pincode: farm.location?.pincode || '',
        landSize: farm.landSize?.value || 5,
        landUnit: farm.landSize?.unit || 'acres',
        soilType: farm.soilType || 'Black Soil',
        currentCrop: farm.currentCrop || 'Wheat',
        plannedCrop: farm.plannedCrop || '',
        growthStage: farm.growthStage || 'Vegetative',
        season: farm.season || 'Kharif'
      });

      if (savedLat && savedLng) {
        setLocationStatus('success');
      }
    }
  }, [farm]);

  // Reverse Geocoding Function using OpenStreetMap Nominatim
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en'
          }
        }
      );
      if (!res.ok) throw new Error('Geocoding service unavailable');
      const data = await res.json();
      const addr = data.address || {};

      const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district || '';
      const district = addr.state_district || addr.county || addr.district || '';
      const state = addr.state || '';
      const country = addr.country || 'India';
      const postcode = addr.postcode || '';
      const street = addr.road || addr.neighbourhood || addr.suburb || '';

      let locationName = '';
      if (city && state) {
        locationName = `${city}, ${state}`;
      } else if (district && state) {
        locationName = `${district}, ${state}`;
      } else if (state) {
        locationName = state;
      } else {
        locationName = `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`;
      }

      const addressParts = [street, city, district, state, postcode, country].filter(Boolean);
      const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : `${locationName}, India`;

      return {
        locationName,
        fullAddress,
        city,
        district,
        state,
        pincode: postcode,
        address: street
      };
    } catch (err) {
      console.warn('Reverse geocoding failed:', err);
      return null;
    }
  };

  // Handle GPS detection
  const handleUseGps = async () => {
    setLocationStatus('detecting');
    setErrorMessage('');

    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      setErrorMessage('Unable to detect your current location. Please enable GPS/location services and try again.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Attempt Reverse Geocoding
        const geocodeResult = await reverseGeocode(latitude, longitude);

        if (geocodeResult && geocodeResult.locationName) {
          setFormData((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            locationName: geocodeResult.locationName,
            fullAddress: geocodeResult.fullAddress,
            city: geocodeResult.city || prev.city,
            district: geocodeResult.district || prev.district,
            state: geocodeResult.state || prev.state,
            pincode: geocodeResult.pincode || prev.pincode,
            address: geocodeResult.address || prev.address,
            manualLocation: geocodeResult.locationName
          }));
          setLocationStatus('success');
        } else {
          // GPS acquisition succeeded, but reverse geocoding lookup failed
          setFormData((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            locationName: `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`,
            fullAddress: `Coordinates: ${latitude}, ${longitude}`,
            manualLocation: `${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)}`
          }));
          setLocationStatus('geocoding_failed');
        }
      },
      (error) => {
        console.warn('GPS Error Code:', error.code, error.message);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('permission_denied');
          setErrorMessage('Location permission is required to detect your current location.');
        } else {
          setLocationStatus('unavailable');
          setErrorMessage('Unable to detect your current location. Please enable GPS/location services and try again.');
        }
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        location: {
          lat: formData.lat,
          lng: formData.lng,
          name: formData.locationName,
          fullAddress: formData.fullAddress,
          display: formData.locationName || formData.manualLocation,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode
        }
      };
      await saveFarm(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving farm profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-slate-900 selection:bg-emerald-600 selection:text-white">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black text-slate-900 flex items-center justify-center sm:justify-start gap-3">
          <Sprout className="w-8 h-8 text-emerald-600" />
          {farm ? 'Update Your Farm Profile' : 'Set Up Your Farm Profile'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 font-medium">
          Personalize KrishiMitra with your location, soil, and crop details to get customized irrigation, weather risk, and market advice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ======================================================== */}
        {/* STEP 1: FARM LOCATION CARD (IMPROVED READABLE LOCATION UI) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:shadow-md transition space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              1. Farm Location
            </h2>
            <button
              type="button"
              onClick={() => setIsEditingLocation(!isEditingLocation)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition border border-emerald-200 cursor-pointer"
            >
              <Edit3 size={13} />
              <span>{isEditingLocation ? 'Done Editing' : 'Edit Location'}</span>
            </button>
          </div>

          {/* LOCATION STATUS CARD */}
          <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-4 space-y-3">
            
            {/* 1. DETECTING STATE */}
            {locationStatus === 'detecting' && (
              <div className="flex items-center gap-3 text-slate-700 text-sm font-bold p-2">
                <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                <span>📍 Detecting your location...</span>
              </div>
            )}

            {/* 2. SUCCESS STATE */}
            {locationStatus === 'success' && formData.locationName && (
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <MapPin size={18} className="text-emerald-600" />
                      {formData.locationName}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 pl-6">
                      {formData.fullAddress || formData.manualLocation}
                    </p>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Current GPS Location
                  </span>
                </div>
              </div>
            )}

            {/* 3. GEOCODING FAILED FALLBACK STATE */}
            {locationStatus === 'geocoding_failed' && (
              <div className="space-y-1 p-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">
                    📍 Location Detected: {formData.lat}, {formData.lng}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    GPS Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Unable to find the readable address.
                </p>
              </div>
            )}

            {/* 4. PERMISSION DENIED STATE */}
            {locationStatus === 'permission_denied' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <span>{errorMessage || 'Location permission is required to detect your current location.'}</span>
                </div>
                <Button
                  type="button"
                  onClick={handleUseGps}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw size={12} /> Try Again
                </Button>
              </div>
            )}

            {/* 5. GPS UNAVAILABLE STATE */}
            {locationStatus === 'unavailable' && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-rose-800 font-bold">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>{errorMessage || 'Unable to detect your current location. Please enable GPS/location services and try again.'}</span>
                </div>
                <Button
                  type="button"
                  onClick={handleUseGps}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw size={12} /> Try Again
                </Button>
              </div>
            )}

            {/* GPS DETECTION BUTTON */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={handleUseGps}
                disabled={locationStatus === 'detecting'}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-xs text-xs cursor-pointer"
              >
                {locationStatus === 'detecting' ? (
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
            </div>

          </div>

          {/* EDITABLE LOCATION FORM (TOGGLED VIA EDIT BUTTON OR WHEN EDITING IS ACTIVE) */}
          {isEditingLocation && (
            <div className="pt-3 border-t border-slate-100 space-y-4 text-xs font-semibold text-slate-700">
              <span className="text-xs font-extrabold text-slate-900 block">Manual Address Details:</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Street / House / Area</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Village Rampur, Near River"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block mb-1">City / Town</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value, locationName: e.target.value ? `${e.target.value}, ${formData.state || 'India'}` : formData.locationName })}
                    placeholder="e.g. Bhopal"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Bhopal District"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value, locationName: formData.city ? `${formData.city}, ${e.target.value}` : e.target.value })}
                    placeholder="e.g. Madhya Pradesh"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="e.g. 462001"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* STEP 2: LAND & SOIL INFO */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:shadow-md transition">
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

        {/* ======================================================== */}
        {/* STEP 3: CROP DETAILS & GROWTH STAGE */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 hover:shadow-md transition">
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
            className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
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
