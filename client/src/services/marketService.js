import api from './api';

export const getMarketCurrent = async (crop, state = '', district = '') => {
  const res = await api.get('/market/current', { params: { crop, state, district } });
  return res.data;
};

export const getMarketHistory = async (crop, period = '7d', state = '', district = '') => {
  const res = await api.get('/market/history', { params: { crop, period, state, district } });
  return res.data;
};

export const getMarketTrend = async (crop, state = '', district = '') => {
  const res = await api.get('/market/trend', { params: { crop, state, district } });
  return res.data;
};

export const getNearbyMarkets = async (crop, state = '', district = '') => {
  const res = await api.get('/market/nearby', { params: { crop, state, district } });
  return res.data;
};
