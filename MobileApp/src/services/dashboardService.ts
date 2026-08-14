import api from './api';

export const getDashboardSummary = async () => {
  try {
    const res = await api.get('/dashboard');
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to load dashboard summary.');
  }
};

export const getCurrentWeather = async () => {
  try {
    const res = await api.get('/weather/current');
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to load weather conditions.');
  }
};

export const getWeatherForecast = async () => {
  try {
    const res = await api.get('/weather/forecast');
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to load weather forecast.');
  }
};

export const getMarketHistory = async (crop: string, period: string = '7d') => {
  try {
    const res = await api.get('/market/history', { params: { crop, period } });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to load market history.');
  }
};

export const getNearbyMarkets = async (crop: string) => {
  try {
    const res = await api.get('/market/nearby', { params: { crop } });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to load nearby market data.');
  }
};
