import api from './api';

export const getMarketCurrent = async (crop) => {
  const res = await api.get('/market/current', { params: { crop } });
  return res.data;
};

export const getMarketHistory = async (crop, period = '7d') => {
  const res = await api.get('/market/history', { params: { crop, period } });
  return res.data;
};

export const getMarketTrend = async (crop) => {
  const res = await api.get('/market/trend', { params: { crop } });
  return res.data;
};

export const getNearbyMarkets = async (crop) => {
  const res = await api.get('/market/nearby', { params: { crop } });
  return res.data;
};
