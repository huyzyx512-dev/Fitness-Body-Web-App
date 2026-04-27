import db from "../models/index.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../errors/AppError.js";
import {
  WORKOUT_STATUS,
  assertCanCompleteWorkout,
  assertCanStartWorkout,
} from "../utils/workoutStatus.js";

const exerciseInclude = {
  model: db.WorkoutExercise,
  as: "exercises",
  attributes: ["id", "sets", "reps", "weight", "comment", "order_index", "rest_time_seconds"],
  include: [
    {
      model: db.Exercise,
      as: "exercise",
      attributes: [
        "id",
        "name",
        "description",
        "category_id",
        "met_value",
        "difficulty_level",
        "equipment",
        "video_url",
        "thumbnail_url",
      ],
      include: [
        { model: db.Category, as: "category", attributes: ["id", "name"] },
        {
          model: db.MuscleGroup,
          as: "muscleGroups",
          through: { attributes: ["is_primary"] },
          attributes: ["id", "name"],
        },
      ],
    },
  ],
};

class WorkoutService {
  static async createWorkout(userId, payload) {
    return db.Workout.create({
      user_id: userId,
      title: payload.title,
      notes: payload.notes,
      scheduled_at: payload.scheduled_at,
      status: WORKOUT_STATUS.PENDING,
    });
  }

  static async updateWorkout(userId, workoutId, payload) {
    const workout = await this.getWorkout(userId, workoutId);

    if (workout.status === WORKOUT_STATUS.COMPLETED) {
      throw new ValidationError("Không thể cập nhật các buổi tập đã hoàn thành");
    }

    await workout.update(payload);
    return this.getWorkout(userId, workoutId);
  }

  static async getWorkout(userId, id) {
    const workout = await db.Workout.findOne({
      where: { id, user_id: userId },
      include: [exerciseInclude],
      order: [[{ model: db.WorkoutExercise, as: "exercises" }, "order_index", "ASC"]],
    });

    if (!workout) {
      throw new NotFoundError("Không tìm thấy buổi tập");
    }

    return workout;
  }

  static async getWorkoutById(id, transaction) {
    return db.Workout.findOne({
      where: { id },
      include: [exerciseInclude],
      order: [[{ model: db.WorkoutExercise, as: "exercises" }, "order_index", "ASC"]],
      transaction,
    });
  }

  static async getAll(userId) {
    return db.Workout.findAll({
      where: { user_id: userId },
      include: [exerciseInclude],
      order: [
        ["createdAt", "ASC"],
        [{ model: db.WorkoutExercise, as: "exercises" }, "order_index", "ASC"],
      ],
    });
  }

  static async delete(id, userId) {
    const affectedRows = await db.Workout.destroy({
      where: { id, user_id: userId },
    });

    if (!affectedRows) {
      throw new NotFoundError("Không tìm thấy buổi tập");
    }
  }

  static async startWorkout(user, workoutId) {
    const workout = await db.Workout.findByPk(workoutId);

    if (!workout) {
      throw new NotFoundError("Không tìm thấy buổi tập");
    }

    if (workout.user_id !== user.id) {
      throw new ForbiddenError("Bạn không có quyền truy cập vào buổi tập này");
    }

    assertCanStartWorkout(workout.status);

    workout.status = WORKOUT_STATUS.IN_PROGRESS;
    workout.started_at = new Date();
    await workout.save();

    return workout;
  }

  static async completeWorkout(user, workoutId, data) {
    const transaction = await db.sequelize.transaction();

    try {
      const userDetails = await db.User.findByPk(user.id, {
        attributes: ["id", "weight", "gender"],
        transaction,
      });

      const workout = await this.getWorkoutById(workoutId, transaction);
      if (!workout) {
        throw new NotFoundError("Không tìm thấy buổi tập");
      }

      if (workout.user_id !== user.id) {
        throw new ForbiddenError("Bạn không có quyền truy cập vào buổi tập này");
      }

      assertCanCompleteWorkout(workout.status);

      const endTime = new Date();
      let durationMinutes = 0;

      if (workout.started_at) {
        const diffMs = endTime.getTime() - new Date(workout.started_at).getTime();
        durationMinutes = Math.floor(diffMs / 60000);
      }

      let totalMet = 0;
      let exerciseCount = 0;
      for (const workoutExercise of workout.exercises || []) {
        if (workoutExercise.exercise?.met_value) {
          totalMet += parseFloat(workoutExercise.exercise.met_value);
          exerciseCount += 1;
        }
      }

      const averageMet = exerciseCount > 0 ? totalMet / exerciseCount : 5.0;
      const userWeight = userDetails?.weight ? parseFloat(userDetails.weight) : 70;
      const caloriesBurned =
        durationMinutes > 0
          ? Math.round((durationMinutes * (averageMet * 3.5 * userWeight)) / 200)
          : 0;

      await workout.update(
        {
          status: WORKOUT_STATUS.COMPLETED,
          ended_at: endTime,
        },
        { transaction },
      );

      await db.WorkoutLog.findOrCreate({
        where: { workout_id: workout.id },
        defaults: {
          workout_id: workout.id,
          completed_at: endTime,
          duration_minutes: durationMinutes,
          calories_burned: caloriesBurned,
          comment: data.comment || "",
        },
        transaction,
      });

      await transaction.commit();

      return {
        workout_id: workout.id,
        duration: durationMinutes,
        calories: caloriesBurned,
      };
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  }
}

export default WorkoutService;
