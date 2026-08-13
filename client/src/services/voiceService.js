import api from './api';

export const sendVoiceQuery = async (query, language) => {
  const res = await api.post('/voice/query', { query, language });
  return res.data;
};

export const getVoiceHistory = async () => {
  const res = await api.get('/voice/history');
  return res.data;
};
