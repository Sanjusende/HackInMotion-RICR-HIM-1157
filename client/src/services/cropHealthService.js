import api from './api';

export const analyzeCropHealth = async (formData) => {
  const res = await api.post('/crop-health/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const getCropHealthHistory = async () => {
  const res = await api.get('/crop-health/history');
  return res.data;
};
