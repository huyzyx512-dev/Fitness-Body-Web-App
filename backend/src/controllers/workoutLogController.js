import asyncHandler from "../middlewares/asyncHandler.js";
import WorkoutLogService from "../services/workoutLogService.js";
import { parseSchema } from "../validators/common.js";
import { workoutLogCreateSchema } from "../validators/workoutValidator.js";

export const getWorkoutLog = asyncHandler(async (req, res) => {
  const workoutLogs = await WorkoutLogService.getAllByUser(req.user.id);
  return res.status(200).json({ workoutLogs });
});

export const createWorkoutLog = asyncHandler(async (req, res) => {
  const payload = parseSchema(workoutLogCreateSchema, req.body);
  const workoutLog = await WorkoutLogService.createForUser(req.user.id, payload);
  return res.status(201).json({ workoutLog });
});
