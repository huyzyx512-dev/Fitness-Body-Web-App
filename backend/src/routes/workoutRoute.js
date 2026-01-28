import express from "express"
import { completeWorkout, createWorkout, deleteWorkout, getWorkout, updateWorkout } from "../controllers/workoutController.js";


const router = express.Router();

router.get("/", getWorkout)
router.post("/", createWorkout)
router.put("/:id", updateWorkout)
router.delete("/:id", deleteWorkout)
router.patch("/:id", completeWorkout)

export default router