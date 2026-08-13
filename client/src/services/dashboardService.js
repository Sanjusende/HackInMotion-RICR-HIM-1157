import api from './api';

export const getDashboardSummary = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};
