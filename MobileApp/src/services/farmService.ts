import api from './api';

export const getMyFarm = async () => {
  try {
    const res = await api.get('/farms/me');
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch farm profile.');
  }
};

export const saveFarmProfile = async (farmData: any) => {
  try {
    const res = await api.post('/farms', farmData);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save farm profile.');
  }
};

export const updateFarmProfile = async (id: string, farmData: any) => {
  try {
    const res = await api.put(`/farms/${id}`, farmData);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update farm profile.');
  }
};
