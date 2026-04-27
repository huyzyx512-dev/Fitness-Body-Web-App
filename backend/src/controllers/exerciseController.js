import asyncHandler from "../middlewares/asyncHandler.js";
import {
  createNewExercise,
  deleteExerciseById,
  getAllExercises,
  updateInfoExercise,
} from "../services/exerciseService.js";
import { parseSchema } from "../validators/common.js";
import {
  exerciseSchema,
  exerciseUpdateSchema,
} from "../validators/exerciseValidator.js";

export const getExercises = asyncHandler(async (req, res) => {
  const exercises = await getAllExercises();
  return res.status(200).json({ exercises });
});

export const createExercise = asyncHandler(async (req, res) => {
  const payload = parseSchema(exerciseSchema, req.body);
  const exercise = await createNewExercise(payload, req.user.id);
  return res.status(201).json({ exercise });
});

export const updateExercise = asyncHandler(async (req, res) => {
  const payload = parseSchema(exerciseUpdateSchema, req.body);
  const exercise = await updateInfoExercise(req.params.id, payload, req.user);
  return res.status(200).json({ exercise });
});

export const deleteExercise = asyncHandler(async (req, res) => {
  await deleteExerciseById(req.params.id, req.user);
  return res.sendStatus(204);
});
