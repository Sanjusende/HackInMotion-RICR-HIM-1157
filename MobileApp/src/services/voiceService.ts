import api from './api';

export const sendVoiceQuery = async (query: string, language: string = 'EN') => {
  try {
    const res = await api.post('/voice/query', { query, language });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit voice query.');
  }
};

export const getVoiceHistory = async () => {
  try {
    const res = await api.get('/voice/history');
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to load voice search logs.');
  }
};
