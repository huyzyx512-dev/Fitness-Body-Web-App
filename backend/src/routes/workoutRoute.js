import express from "express"
import { 
    addExerciseToWorkout, 
    completeWorkout, 
    createWorkout,
    deleteWorkout, 
    getWorkout, 
    removeExerciseToWorkout, 
    startWorkout, 
    updateExerciseToWorkout, 
    updateWorkout
} from "../controllers/workoutController.js";


const router = express.Router();

router.get("/", getWorkout)
router.post("/", createWorkout)
router.put("/:id", updateWorkout)
router.delete("/:id", deleteWorkout)
router.put("/:id/start", startWorkout);
router.patch("/:id/complete", completeWorkout)
router.post("/:workoutId/exercise/:exerciseId", addExerciseToWorkout)
router.put("/:workoutId/exercise/:exerciseId", updateExerciseToWorkout)
router.delete("/:workoutId/workout-exercise/:workoutExerciseId", removeExerciseToWorkout)

export default router