import axios from 'axios';
import Weather from '../../models/Weather.js';

/**
 * Converts Open-Meteo WMO weather codes into readable weather conditions.
 */
const mapWmoCodeToCondition = (code) => {
  if (code === 0) return { condition: 'Clear Sky', isRainy: false };
  if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', isRainy: false };
  if (code >= 45 && code <= 48) return { condition: 'Foggy', isRainy: false };
  if (code >= 51 && code <= 67) return { condition: 'Light Rain / Drizzle', isRainy: true };
  if (code >= 71 && code <= 77) return { condition: 'Snow', isRainy: false };
  if (code >= 80 && code <= 82) return { condition: 'Heavy Rain Showers', isRainy: true };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', isRainy: true };
  return { condition: 'Cloudy', isRainy: false };
};

/**
 * Maps US AQI values to Air Quality Index text.
 */
const mapAqiToCondition = (aqi) => {
  if (!aqi) return 'Good';
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  return 'Unhealthy';
};

export const fetchOpenMeteoWeather = async (lat, lng) => {
  const latitude = Number(Number(lat || 22.7196).toFixed(4));
  const longitude = Number(Number(lng || 75.8577).toFixed(4));

  // 1. Check database cache first (15-minute validity window)
  try {
    const tolerance = 0.01; // roughly 1.1km
    const cacheCutoff = new Date(Date.now() - 15 * 60 * 1000);

    const cached = await Weather.findOne({
      latitude: { $gte: latitude - tolerance, $lte: latitude + tolerance },
      longitude: { $gte: longitude - tolerance, $lte: longitude + tolerance },
      fetchedAt: { $gte: cacheCutoff },
    })
      .sort({ fetchedAt: -1 })
      .lean();

    if (cached) {
      console.log(`[WeatherService] Serving coordinates [${latitude}, ${longitude}] from DB cache.`);
      return cached;
    }
  } catch (cacheErr) {
    console.error('[WeatherService] Cache lookup error:', cacheErr.message);
  }

  // 2. Cache miss: fetch new data from Open-Meteo forecast API & Air Quality API
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m` +
      `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max,sunrise,sunset` +
      `&timezone=auto&forecast_days=7`;

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi`;

    console.log(`[WeatherService] Fetching weather from Open-Meteo: ${url}`);
    
    // Concurrently fetch weather and AQI
    const [weatherRes, aqiRes] = await Promise.allSettled([
      axios.get(url, { timeout: 8000 }),
      axios.get(aqiUrl, { timeout: 5000 }),
    ]);

    let weatherData = null;
    if (weatherRes.status === 'fulfilled') {
      weatherData = weatherRes.value.data;
    } else {
      throw new Error(weatherRes.reason?.message || 'Weather API failed');
    }

    let airQuality = 'Good';
    if (aqiRes.status === 'fulfilled' && aqiRes.value.data?.current?.us_aqi) {
      airQuality = mapAqiToCondition(aqiRes.value.data.current.us_aqi);
    }

    if (weatherData) {
      const current = weatherData.current || {};
      const daily = weatherData.daily || {};
      const hourly = weatherData.hourly || {};

      const currentCondition = mapWmoCodeToCondition(current.weather_code || 0);

      // Parse daily forecasts
      const forecast = (daily.time || []).map((dateStr, index) => {
        const cond = mapWmoCodeToCondition(daily.weather_code ? daily.weather_code[index] : 0);
        return {
          date: dateStr,
          tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[index] : 30,
          tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[index] : 20,
          rainProbability: daily.precipitation_probability_max
            ? daily.precipitation_probability_max[index]
            : 0,
          rainfallMm: daily.precipitation_sum ? daily.precipitation_sum[index] : 0,
          condition: cond.condition,
        };
      });

      const todayForecast = forecast[0] || {
        rainProbability: 20,
        rainfallMm: 0,
        tempMax: 32,
        tempMin: 22,
      };

      // Parse hourly forecasts (next 12 hours)
      const hourlySeries = [];
      const nowHour = new Date().getHours();
      if (hourly.time) {
        for (let i = 0; i < 12; i++) {
          const idx = (nowHour + i) % hourly.time.length;
          hourlySeries.push({
            time: hourly.time[idx] ? hourly.time[idx].split('T')[1] : `${(nowHour + i) % 24}:00`,
            temp: hourly.temperature_2m ? hourly.temperature_2m[idx] : 25,
            humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[idx] : 60,
            rainProb: hourly.precipitation_probability ? hourly.precipitation_probability[idx] : 10,
          });
        }
      }

      // Generate Agricultural Severe Weather Alerts
      const alerts = [];
      if (current.temperature_2m > 38) {
        alerts.push({
          event: 'Extreme Heat Warning',
          senderName: 'KrishiMitra Agro-Meteorological Dept',
          description: 'Temperatures exceed 38°C. Provide light frequent irrigations to crops and avoid midday operations.',
        });
      }
      if (current.wind_speed_10m > 25) {
        alerts.push({
          event: 'High Wind Warning',
          senderName: 'KrishiMitra Agro-Meteorological Dept',
          description: 'Wind speed is above 25 km/h. Postpone foliar pesticide sprays and crop dusting to avoid chemical drift.',
        });
      }
      if (todayForecast.rainfallMm > 25) {
        alerts.push({
          event: 'Heavy Rainfall Alert',
          senderName: 'KrishiMitra Agro-Meteorological Dept',
          description: 'Precipitation exceeds 25mm today. Clear field drains immediately to prevent seedling waterlogging.',
        });
      }

      const uvIndex = daily.uv_index_max ? daily.uv_index_max[0] : 5.0;
      const sunrise = daily.sunrise ? daily.sunrise[0].split('T')[1] : '06:00';
      const sunset = daily.sunset ? daily.sunset[0].split('T')[1] : '18:30';

      const weatherReport = {
        latitude,
        longitude,
        temperature: current.temperature_2m ?? todayForecast.tempMax,
        humidity: current.relative_humidity_2m ?? 65,
        windSpeed: current.wind_speed_10m ?? 10,
        rainProbability: todayForecast.rainProbability,
        rainfallMm: todayForecast.rainfallMm,
        weatherCondition: currentCondition.condition,
        uvIndex,
        airQuality,
        sunrise,
        sunset,
        hourly: hourlySeries,
        alerts,
        forecast,
        fetchedAt: new Date(),
        source: 'open-meteo',
      };

      // Seeding database with cache entry
      try {
        await Weather.create(weatherReport);
      } catch (dbErr) {
        console.error('[WeatherService] Seeding cache failed:', dbErr.message);
      }

      return weatherReport;
    }
  } catch (error) {
    console.warn('[WeatherService] Open-Meteo call failed. Returning cached fallback:', error.message);
  }

  // Final Fallback if API completely crashes
  return {
    latitude,
    longitude,
    temperature: 28,
    humidity: 60,
    windSpeed: 12,
    rainProbability: 25,
    rainfallMm: 1.5,
    weatherCondition: 'Partly Cloudy',
    uvIndex: 4.5,
    airQuality: 'Good',
    sunrise: '06:05',
    sunset: '18:42',
    hourly: Array.from({ length: 12 }).map((_, i) => ({
      time: `${(8 + i) % 24}:00`,
      temp: 26 + (i % 3),
      humidity: 65,
      rainProb: 15,
    })),
    alerts: [],
    forecast: [
      {
        date: new Date().toISOString().split('T')[0],
        tempMax: 32,
        tempMin: 21,
        rainProbability: 25,
        rainfallMm: 1.5,
        condition: 'Partly Cloudy',
      },
    ],
    fetchedAt: new Date(),
    source: 'cache-fallback',
  };
};
