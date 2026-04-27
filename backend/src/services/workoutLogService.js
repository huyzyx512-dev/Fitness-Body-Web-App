import db from "../models/index.js";
import { ForbiddenError, NotFoundError } from "../errors/AppError.js";

class WorkoutLogService {
  static async getAllByUser(userId) {
    return db.WorkoutLog.findAll({
      include: [
        {
          model: db.Workout,
          as: "workout",
          where: { user_id: userId },
          attributes: ["id", "title", "status", "scheduled_at", "started_at", "ended_at"],
        },
      ],
      order: [["completed_at", "DESC"]],
    });
  }

  static async createForUser(userId, payload) {
    const workout = await db.Workout.findByPk(payload.workout_id);
    if (!workout) {
      throw new NotFoundError("Không tìm thấy buổi tập");
    }

    if (workout.user_id !== userId) {
      throw new ForbiddenError("Bạn không có quyền truy cập vào buổi tập này");
    }

    const existingLog = await db.WorkoutLog.findOne({
      where: { workout_id: workout.id },
    });

    if (existingLog) {
      return existingLog;
    }

    return db.WorkoutLog.create({
      workout_id: workout.id,
      completed_at: payload.completed_at ? new Date(payload.completed_at) : new Date(),
      duration_minutes: payload.duration_minutes,
      calories_burned: payload.calories_burned,
      comment: payload.comment || "",
    });
  }
}

export default WorkoutLogService;
