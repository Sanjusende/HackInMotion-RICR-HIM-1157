import axios from 'axios';

/**
 * Reverse geocode latitude and longitude to a human-readable location name
 * using Open-Meteo / Nominatim public geocoding API.
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'SmartFarm-DecisionSupport/1.0'
        },
        timeout: 5000
      }
    );

    if (response.data && response.data.address) {
      const addr = response.data.address;
      const district = addr.state_district || addr.county || addr.city || addr.town || addr.village || 'Indore';
      const state = addr.state || 'Madhya Pradesh';
      const village = addr.village || addr.suburb || addr.town || '';

      const display = village ? `${village}, ${district}, ${state}` : `${district}, ${state}`;

      return {
        display,
        state,
        district,
        village,
        lat: Number(lat),
        lng: Number(lng)
      };
    }
  } catch (err) {
    console.warn('Geocoding API warning, fallback used:', err.message);
  }

  // Sensible default fallback if external API is unreachable or fails
  return {
    display: 'Indore, Madhya Pradesh',
    state: 'Madhya Pradesh',
    district: 'Indore',
    village: 'Rural Farm',
    lat: Number(lat) || 22.7196,
    lng: Number(lng) || 75.8577
  };
};

/**
 * Forward geocode a location string (State/District/Village) to lat/lng coordinates
 */
export const forwardGeocode = async (locationStr) => {
  try {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationStr)}&count=1`,
      { timeout: 5000 }
    );

    if (response.data && response.data.results && response.data.results.length > 0) {
      const res = response.data.results[0];
      return {
        lat: res.latitude,
        lng: res.longitude,
        display: `${res.name}, ${res.admin1 || ''}`
      };
    }
  } catch (err) {
    console.warn('Forward geocoding error:', err.message);
  }

  // Fallback defaults for Indore region if lookup fails
  return {
    lat: 22.7196,
    lng: 75.8577,
    display: locationStr
  };
};
