import axiosInstance from '../api/axiosInstance.js';

export const userService = {
  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/user');
    return response.data;
  },
};
