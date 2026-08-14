import api from './api';

export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login request failed.');
  }
};

export const registerUser = async (name: string, email: string, phone: string, password: string) => {
  try {
    const res = await api.post('/auth/register', { name, email, phone, password, role: 'FARMER', language: 'EN' });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration request failed.');
  }
};

export const logoutUser = async (refreshToken: string) => {
  try {
    const res = await api.post('/auth/logout', { refreshToken });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Logout request failed.');
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Forgot password request failed.');
  }
};

export const getProfile = async (token?: string) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await api.get('/farm/profile', { headers });
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { success: true, profileComplete: false };
    }
    return { success: false, error: error.message };
  }
};
