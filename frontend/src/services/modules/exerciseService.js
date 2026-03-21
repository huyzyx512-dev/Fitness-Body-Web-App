import axiosInstance from '../api/axiosInstance.js';

export const exerciseService = {
  // Get all exercises
  getAll: async () => {
    const response = await axiosInstance.get('/exercises');
    return response.data;
  },

  // Create new exercise
  create: async (data) => {
    const response = await axiosInstance.post('/exercises', data);
    return response.data;
  },

  // Update exercise
  update: async (id, data) => {
    const response = await axiosInstance.put(`/exercises/${id}`, data);
    return response.data;
  },

  // Delete exercise
  delete: async (id) => {
    await axiosInstance.delete(`/exercises/${id}`);
  },
};
