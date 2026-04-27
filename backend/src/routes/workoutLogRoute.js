import express from "express";
import { createWorkoutLog, getWorkoutLog } from "../controllers/workoutLogController.js";

const router = express.Router();

router.get("/", getWorkoutLog);
router.post("/", createWorkoutLog);

export default router;
