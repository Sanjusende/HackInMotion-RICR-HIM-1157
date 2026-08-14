import Farm from '../models/Farm.js';
import ApiResponse from '../utils/apiResponse.js';
import { fetchOpenMeteoWeather } from '../services/weather/openMeteoService.js';
import { calculateCropSuitability } from '../services/cropRecommendation/cropRecommendationEngine.js';

export const getCropRecommendations = async (req, res, next) => {
  try {
    const N = Number(req.query.N || 80);
    const P = Number(req.query.P || 40);
    const K = Number(req.query.K || 40);
    const pH = Number(req.query.pH || 6.5);

    let lat = 22.7196;
    let lng = 75.8577;
    let season = 'Kharif';
    let soilType = 'Black Soil';

    const farm = await Farm.findOne({ userId: req.user._id });
    if (farm) {
      if (farm.location?.lat) lat = farm.location.lat;
      if (farm.location?.lng) lng = farm.location.lng;
      if (farm.season) season = farm.season;
      if (farm.soilType) soilType = farm.soilType;
    }

    // Fetch weather data for temperature and rainfall inputs
    const weather = await fetchOpenMeteoWeather(lat, lng);
    const temperature = weather?.temperature ?? 28;
    const rainfall = weather?.rainfallMm ?? 2.0;

    const recommendations = calculateCropSuitability({
      N,
      P,
      K,
      pH,
      temperature,
      rainfall,
      season,
      soilType,
    });

    return ApiResponse.success(
      res,
      recommendations,
      'Crop suitability recommendations generated successfully'
    );
  } catch (error) {
    next(error);
  }
};
