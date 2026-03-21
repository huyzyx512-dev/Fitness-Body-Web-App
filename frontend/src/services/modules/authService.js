import axiosInstance from '../api/axiosInstance.js';

export const authService = {
  // Register new user
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Logout user
  logout: async () => {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  // Refresh access token
  refreshToken: async () => {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response.data;
  },
};
