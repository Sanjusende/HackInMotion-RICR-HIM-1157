import api from './api';

export const analyzeIrrigation = async (farmId) => {
  const res = await api.post('/irrigation/analyze', { farmId });
  return res.data;
};

export const getIrrigationHistory = async () => {
  const res = await api.get('/irrigation/history');
  return res.data;
};
