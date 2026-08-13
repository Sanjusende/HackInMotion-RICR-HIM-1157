import api from './api';

export const getMyFarm = async () => {
  const response = await api.get('/farms/me');
  return response.data;
};

export const saveFarmProfile = async (farmData) => {
  const response = await api.post('/farms', farmData);
  return response.data;
};

export const updateFarmProfile = async (id, farmData) => {
  const response = await api.put(`/farms/${id}`, farmData);
  return response.data;
};
