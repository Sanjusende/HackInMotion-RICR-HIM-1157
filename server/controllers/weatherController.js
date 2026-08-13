import Farm from '../models/Farm.js';
import Weather from '../models/Weather.js';
import { fetchOpenMeteoWeather } from '../services/weather/openMeteoService.js';

export const getCurrentWeather = async (req, res) => {
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

    if (farm) {
      try {
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
          source: weatherData.source
        });
      } catch (saveErr) {
        // Non-blocking log save error
      }
    }

    return res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Weather controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to load current weather data'
    });
  }
};

export const getWeatherForecast = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      data: weatherData.forecast || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unable to load weather forecast'
    });
  }
};
