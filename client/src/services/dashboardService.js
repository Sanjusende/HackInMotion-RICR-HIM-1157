import api from './api';

export const getDashboardSummary = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};

export const getDashboardAnalytics = async (period = 'monthly') => {
  const res = await api.get('/dashboard/analytics', { params: { period } });
  return res.data;
};
