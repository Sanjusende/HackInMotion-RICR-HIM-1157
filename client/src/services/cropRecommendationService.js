import api from './api';

export const getCropRecommendations = async (params) => {
  const res = await api.get('/crop-recommendation', { params });
  return res.data;
};
