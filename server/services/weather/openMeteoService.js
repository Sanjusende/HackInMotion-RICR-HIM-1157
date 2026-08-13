import axios from 'axios';

/**
 * Converts Open-Meteo WMO weather codes into readable weather conditions.
 * Also identifies whether the condition indicates rainfall.
 *
 * @param {number} code - WMO weather interpretation code.
 * @returns {{ condition: string, isRainy: boolean }}
 */
const mapWmoCodeToCondition = (code) => {
  if (code === 0) {
    return { condition: 'Clear Sky', isRainy: false };
  }

  if (code >= 1 && code <= 3) {
    return { condition: 'Partly Cloudy', isRainy: false };
  }

  if (code >= 45 && code <= 48) {
    return { condition: 'Foggy', isRainy: false };
  }

  if (code >= 51 && code <= 67) {
    return { condition: 'Light Rain / Drizzle', isRainy: true };
  }

  if (code >= 71 && code <= 77) {
    return { condition: 'Snow', isRainy: false };
  }

  if (code >= 80 && code <= 82) {
    return { condition: 'Heavy Rain Showers', isRainy: true };
  }

  if (code >= 95 && code <= 99) {
    return { condition: 'Thunderstorm', isRainy: true };
  }

  return { condition: 'Cloudy', isRainy: false };
};

/**
 * Retrieves current weather conditions and daily forecast data
 * from the Open-Meteo API.
 *
 * Falls back to predefined weather data when the external API
 * is unavailable or returns an error.
 *
 * @param {number} lat - Geographic latitude.
 * @param {number} lng - Geographic longitude.
 * @returns {Promise<Object>} Current weather and forecast information.
 */
export const fetchOpenMeteoWeather = async (lat, lng) => {
  const latitude = lat || 22.7196;
  const longitude = lng || 75.8577;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

    const response = await axios.get(url, { timeout: 6000 });

    if (response.data) {
      const current = response.data.current || {};
      const daily = response.data.daily || {};

      const currentCondition = mapWmoCodeToCondition(
        current.weather_code || 0
      );

      const forecast = (daily.time || []).map((dateStr, index) => {
        const condition = mapWmoCodeToCondition(
          daily.weather_code ? daily.weather_code[index] : 0
        );

        return {
          date: dateStr,
          tempMax: daily.temperature_2m_max
            ? daily.temperature_2m_max[index]
            : 30,
          tempMin: daily.temperature_2m_min
            ? daily.temperature_2m_min[index]
            : 20,
          rainProbability: daily.precipitation_probability_max
            ? daily.precipitation_probability_max[index]
            : 0,
          rainfallMm: daily.precipitation_sum
            ? daily.precipitation_sum[index]
            : 0,
          condition: condition.condition,
        };
      });

      const todayForecast = forecast[0] || {
        rainProbability: 20,
        rainfallMm: 0,
        tempMax: 32,
        tempMin: 22,
      };

      return {
        temperature:
          current.temperature_2m ?? todayForecast.tempMax,
        humidity: current.relative_humidity_2m ?? 65,
        windSpeed: current.wind_speed_10m ?? 10,
        rainProbability: todayForecast.rainProbability,
        rainfallMm: todayForecast.rainfallMm,
        weatherCondition: currentCondition.condition,
        forecast,
        fetchedAt: new Date(),
        source: 'open-meteo',
      };
    }
  } catch (error) {
    console.warn(
      'Open-Meteo API request failed. Returning fallback weather data:',
      error.message
    );
  }

  // Provides a stable fallback response when the external weather service
  // is unavailable, times out, or returns an unexpected response.
  return {
    temperature: 28,
    humidity: 60,
    windSpeed: 12,
    rainProbability: 25,
    rainfallMm: 1.5,
    weatherCondition: 'Partly Cloudy',
    forecast: [
      {
        date: new Date().toISOString().split('T')[0],
        tempMax: 32,
        tempMin: 21,
        rainProbability: 25,
        rainfallMm: 1.5,
        condition: 'Partly Cloudy',
      },
      {
        date: new Date(Date.now() + 86400000)
          .toISOString()
          .split('T')[0],
        tempMax: 33,
        tempMin: 22,
        rainProbability: 15,
        rainfallMm: 0,
        condition: 'Sunny',
      },
      {
        date: new Date(Date.now() + 172800000)
          .toISOString()
          .split('T')[0],
        tempMax: 31,
        tempMin: 20,
        rainProbability: 75,
        rainfallMm: 18,
        condition: 'Heavy Rain',
      },
    ],
    fetchedAt: new Date(),
    source: 'cache-fallback',
  };
};