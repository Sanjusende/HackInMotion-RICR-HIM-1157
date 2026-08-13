import api from './api';

export const getCurrentWeather = async () => {
  const res = await api.get('/weather/current');
  return res.data;
};

export const getWeatherForecast = async () => {
  const res = await api.get('/weather/forecast');
  return res.data;
};
