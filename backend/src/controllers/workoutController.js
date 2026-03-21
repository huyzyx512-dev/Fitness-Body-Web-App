
import { addExerciseToWorkoutById, completeWorkoutByUser, removeExerciseToWorkoutById, startWorkoutById } from "../services/exerciseService.js";
import WorkoutService from "../services/workoutService.js";

export const createWorkout = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại" })
        }

        const { title, notes, scheduled_at } = req.body;

        if (!title || !notes || !scheduled_at) {
            return res.status(400).json({ message: "Không thể thiếu title, notes, scheduled_at" })
        }

        const data = await WorkoutService.createWorkout(user.id, title, notes, scheduled_at);

        return res.status(200).json({ data });
    } catch (error) {
        console.log("Lỗi trong quá trình create workout: ", error)
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const updateWorkout = async (req, res) => {
    try {
        const workoutId = req.params.id;
        const user = req.user;
        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại" })
        }

        const data = await WorkoutService.updateWorkout(user.id, req.body, workoutId);

        return res.status(200).json({ updated_data: data });
    } catch (error) {
        console.log("Lỗi trong quá trình create workout: ", error)
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const deleteWorkout = async (req, res) => {
    try {
        const workoutId = req.params.id;
        const userId = req.user.id;

        const data = await WorkoutService.delete(workoutId, userId);

        if (data == 0) {
            return res.sendStatus(404);
        }

        return res.sendStatus(204);
    } catch (error) {
        console.log("Lỗi trong quá trình delete workout", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const getWorkout = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại" })
        }

        const workouts = await WorkoutService.getAll(user.id);

        return res.status(200).json({ workouts })
    } catch (error) {
        console.log("Lỗi trong quá trình get workouts", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const completeWorkout = async (req, res) => {
    try {
        const result = await completeWorkoutByUser(req.user, req.params.id, req.body);

        return res.status(200).json({
            message: "Hoàn thành bài tập thành công",
            data: result
        });
    } catch (error) {
        console.error("Lỗi completeWorkout:", error);

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message || "Lỗi hệ thống"
        });
    }
}

export const addExerciseToWorkout = async (req, res) => {
    try {
        await addExerciseToWorkoutById(req.user, req.params, req.body);

        return res.status(200).json({ message: "Thêm bài tập vào lịch thành công!" });
    } catch (error) {
        console.error("Lỗi addExerciseToWorkout:", error);

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message || "Lỗi hệ thống"
        });
    }
}

export const removeExerciseToWorkout = async (req, res) => {
    try {
        await removeExerciseToWorkoutById(req.user, req.params);

        return res.status(200).json({ message: "Xóa bài tập khỏi lịch thành công!" });
    } catch (error) {
        console.error("Lỗi removeExerciseToWorkout:", error);

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message || "Lỗi hệ thống"
        });
    }
}

export const startWorkout = async (req, res) => {
    try {
        // Truyền req.params để lấy ID
        const workout = await startWorkoutById(req.user, req.params);

        return res.status(200).json({
            message: "Bắt đầu buổi tập thành công",
            data: {
                id: workout.id,
                status: workout.status,
                started_at: workout.started_at // Trả về để Frontend đồng bộ đồng hồ
            }
        });
    } catch (error) {
        console.error("Lỗi startWorkout:", error);

        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            message: error.message || "Lỗi hệ thống"
        });
    }
}

//TODO: Không tính được calories khi hoàn thành bài tập

