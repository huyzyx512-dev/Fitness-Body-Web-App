import express from "express"
import { authenticationToken } from "../middlewares/authMiddleware.js";
import { createExercise, deleteExercise, getExercises, updateExercise } from "../controllers/exerciseController.js";

const router = express.Router();

router.get('/', getExercises);

router.post('/', authenticationToken, createExercise);

router.put('/:id', authenticationToken, updateExercise);

router.delete('/:id', authenticationToken, deleteExercise);

export default router