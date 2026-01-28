import db from "../models/index.js";

class WorkoutService {
    static async createWorkout(
        user_id,
        title,
        status,
        notes,
        scheduled_at) {
        const data = await db.Workout.create({
            user_id,
            title,
            status,
            notes,
            scheduled_at
        })

        return data;
    }

    static async updateWorkout(
        user_id,
        data,
        workoutId) {
        const workout = await this.getWorkout(user_id, workoutId);

        if (!workout) return {};

        const affectedRows = await db.Workout.update(data, {
            where: { id: workoutId, user_id: user_id }
        })

        return affectedRows;
    }

    static async getWorkout(user_id, id) {

        const workout = await db.Workout.findOne({
            where: { id: id, user_id: user_id },
            raw: true,
            nest: true
        })

        return workout;
    }

    static async getAll(userId) {
        const workouts = await db.Workout.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'ASC']]
        });

        return workouts;
    }

    static async delete(id, userId) {
        const affectedRows = await db.Workout.destroy({
            where: { id, user_id: userId }
        });

        return affectedRows;
    }
}

export default WorkoutService;