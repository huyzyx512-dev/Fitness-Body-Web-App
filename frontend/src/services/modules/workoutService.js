import axiosInstance from '../api/axiosInstance.js';

export const workoutService = {
  // Get all workouts
  getAll: async () => {
    const response = await axiosInstance.get('/workouts');
    return response.data;
  },

  // Create new workout
  create: async (data) => {
    const response = await axiosInstance.post('/workouts', data);
    return response.data;
  },

  // Update workout
  update: async (id, data) => {
    const response = await axiosInstance.put(`/workouts/${id}`, data);
    return response.data;
  },

  // Delete workout
  delete: async (id) => {
    await axiosInstance.delete(`/workouts/${id}`);
  },

  // Start workout
  start: async (id) => {
    const response = await axiosInstance.put(`/workouts/${id}/start`);
    return response.data;
  },

  // Complete workout
  complete: async (id, data) => {
    const response = await axiosInstance.patch(`/workouts/${id}/complete`, data);
    return response.data;
  },

  // Add exercise to workout
  addExercise: async (workoutId, exerciseId, data) => {
    const response = await axiosInstance.post(
      `/workouts/${workoutId}/exercise/${exerciseId}`,
      data
    );
    return response.data;
  },

  // Remove exercise from workout
  removeExercise: async (workoutId, workoutExerciseId) => {
    const response = await axiosInstance.delete(
      `/workouts/${workoutId}/workout-exercise/${workoutExerciseId}`
    );
    return response.data;
  },
};
