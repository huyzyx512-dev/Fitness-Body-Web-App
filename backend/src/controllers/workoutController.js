import asyncHandler from "../middlewares/asyncHandler.js";
import {
  addExerciseToWorkoutById,
  removeExerciseToWorkoutById,
  updateExerciseToWorkoutById,
} from "../services/exerciseService.js";
import WorkoutService from "../services/workoutService.js";
import { parseSchema } from "../validators/common.js";
import {
  completeWorkoutSchema,
  createWorkoutSchema,
  updateWorkoutSchema,
} from "../validators/workoutValidator.js";
import { workoutExerciseSchema } from "../validators/exerciseValidator.js";

export const createWorkout = asyncHandler(async (req, res) => {
  const payload = parseSchema(createWorkoutSchema, req.body);
  const workout = await WorkoutService.createWorkout(req.user.id, payload);
  return res.status(201).json({ workout });
});

export const updateWorkout = asyncHandler(async (req, res) => {
  const payload = parseSchema(updateWorkoutSchema, req.body);
  const workout = await WorkoutService.updateWorkout(req.user.id, req.params.id, payload);
  return res.status(200).json({ workout });
});

export const deleteWorkout = asyncHandler(async (req, res) => {
  await WorkoutService.delete(req.params.id, req.user.id);
  return res.sendStatus(204);
});

export const getWorkout = asyncHandler(async (req, res) => {
  const workouts = await WorkoutService.getAll(req.user.id);
  return res.status(200).json({ workouts });
});

export const completeWorkout = asyncHandler(async (req, res) => {
  const payload = parseSchema(completeWorkoutSchema, req.body || {});
  const result = await WorkoutService.completeWorkout(req.user, req.params.id, payload);
  return res.status(200).json({
    message: "Hoàn thành buổi tập thành công",
    data: result,
  });
});

export const addExerciseToWorkout = asyncHandler(async (req, res) => {
  const payload = parseSchema(workoutExerciseSchema, req.body);
  await addExerciseToWorkoutById(req.user, req.params, payload);
  return res.status(200).json({ message: "Thêm bài tập vào buổi tập thành công" });
});

export const updateExerciseToWorkout = asyncHandler(async (req, res) => {
  const payload = parseSchema(workoutExerciseSchema, req.body);
  await updateExerciseToWorkoutById(req.user, req.params, payload);
  return res.status(200).json({ message: "Cập nhật bài tập trong buổi tập thành công" });
});

export const removeExerciseToWorkout = asyncHandler(async (req, res) => {
  await removeExerciseToWorkoutById(req.user, req.params);
  return res.status(200).json({ message: "Xóa bài tập khỏi buổi tập thành công" });
});

export const startWorkout = asyncHandler(async (req, res) => {
  const workout = await WorkoutService.startWorkout(req.user, req.params.id);
  return res.status(200).json({
    message: "Bắt đầu buổi tập thành công",
    data: {
      id: workout.id,
      status: workout.status,
      started_at: workout.started_at,
    },
  });
});
