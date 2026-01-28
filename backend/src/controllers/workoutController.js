
import WorkoutService from "../services/workoutService.js";

export const createWorkout = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại" })
        }

        const { title, notes, scheduled_at, status } = req.body;

        if (!title || !notes || !scheduled_at || !status) {
            return res.status(400).json({ message: "Không thể thiếu title, notes, scheduled_at, status" })
        }

        const data = await WorkoutService.createWorkout(user.id, title, status, notes, scheduled_at);

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
        // Change status to completed

        // Calculate calories burned and duration (min)

        // Insert workout log

        // return 
    } catch (error) {
        console.log("Lỗi trong quá trình complete workout", error);
        return res.status(500).json({ message: "Lỗi hệ thống" })
    }
}