import Farm from '../models/Farm.js';
import Weather from '../models/Weather.js';
import { fetchOpenMeteoWeather } from '../services/weather/openMeteoService.js';

// Get current weather for the user's farm
export const getCurrentWeather = async (req, res) => {
  try {
    const farm = await Farm.findOne({ userId: req.user._id });

    const lat = farm?.location?.lat || 22.7196;
    const lng = farm?.location?.lng || 75.8577;

    const weatherData = await fetchOpenMeteoWeather(lat, lng);

    if (farm) {
      await Weather.create({
        farmId: farm._id,
        fetchedAt: weatherData.fetchedAt,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        rainProbability: weatherData.rainProbability,
        rainfallMm: weatherData.rainfallMm,
        weatherCondition: weatherData.weatherCondition,
        forecast: weatherData.forecast,
        source: weatherData.source,
      });
    }

    return res.status(200).json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error('Weather controller error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to load current weather data',
    });
  }
};

// Get weather forecast for the user's farm
export const getWeatherForecast = async (req, res) => {
  try {
    const farm = await Farm.findOne({ userId: req.user._id });

    const lat = farm?.location?.lat || 22.7196;
    const lng = farm?.location?.lng || 75.8577;

    const weatherData = await fetchOpenMeteoWeather(lat, lng);

    return res.status(200).json({
      success: true,
      data: weatherData.forecast || [],
    });
  } catch (error) {
    console.error('Weather forecast controller error:', error);

    return res.status(500).json({
      success: false,
      error: 'Unable to load weather forecast',
    });
  }
};