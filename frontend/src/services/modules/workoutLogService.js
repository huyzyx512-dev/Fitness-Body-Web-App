import axiosInstance from '../api/axiosInstance.js';

/**
 * Workout Log API – sẵn sàng khi backend implement getWorkoutLog / createWorkoutLog.
 * Base path: /workout-logs (backend app.use('/api/workout-logs', ...))
 */
export const workoutLogService = {
  getList: async () => {
    const response = await axiosInstance.get('/workout-logs');
    const data = response.data;
    if (data == null || (typeof data === 'object' && !Array.isArray(data) && !data.logs)) {
      return { logs: [] };
    }
    return data;
  },

  create: async (data) => {
    const response = await axiosInstance.post('/workout-logs', data);
    return response.data;
  },
};
