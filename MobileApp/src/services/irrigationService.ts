import api from './api';

export const analyzeIrrigation = async (farmId: string) => {
  try {
    const res = await api.post('/irrigation/analyze', { farmId });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to trigger irrigation analysis.');
  }
};

export const getIrrigationHistory = async () => {
  try {
    const res = await api.get('/irrigation/history');
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to load irrigation history.');
  }
};
