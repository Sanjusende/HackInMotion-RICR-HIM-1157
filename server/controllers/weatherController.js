import Farm from '../models/Farm.js';
import Weather from '../models/Weather.js';
import ApiResponse from '../utils/apiResponse.js';
import { fetchOpenMeteoWeather } from '../services/weather/openMeteoService.js';

/**
 * Get current weather details for the user's farm location
 */
export const getCurrentWeather = async (req, res, next) => {
  try {
    let lat = 22.7196;
    let lng = 75.8577;
    let farm = null;

    try {
      farm = await Farm.findOne({ userId: req.user._id });
      if (farm?.location?.lat && farm?.location?.lng) {
        lat = farm.location.lat;
        lng = farm.location.lng;
      }
    } catch (dbErr) {
      console.warn('DB lookup fallback in weather controller:', dbErr.message);
    }

    const weatherData = await fetchOpenMeteoWeather(lat, lng);

    // Associate cached record with farm if available
    if (farm && weatherData && (weatherData._id || weatherData.id)) {
      try {
        await Weather.findByIdAndUpdate(weatherData._id || weatherData.id, { farmId: farm._id });
      } catch (saveErr) {
        console.warn('Failed to associate weather record with farm:', saveErr.message);
      }
    }

    return ApiResponse.success(res, weatherData, 'Current weather data loaded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get weather forecast detail list
 */
export const getWeatherForecast = async (req, res, next) => {
  try {
    let lat = 22.7196;
    let lng = 75.8577;

    try {
      const farm = await Farm.findOne({ userId: req.user._id });
      if (farm?.location?.lat && farm?.location?.lng) {
        lat = farm.location.lat;
        lng = farm.location.lng;
      }
    } catch (dbErr) {
      console.warn('DB lookup fallback in forecast controller:', dbErr.message);
    }

    const weatherData = await fetchOpenMeteoWeather(lat, lng);

    return ApiResponse.success(
      res,
      weatherData.forecast || [],
      'Weather forecast loaded successfully'
    );
  } catch (error) {
    next(error);
  }
};
