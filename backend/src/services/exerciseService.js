import db from "../models/index.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../errors/AppError.js";
import { WORKOUT_STATUS } from "../utils/workoutStatus.js";

const exerciseInclude = [
  {
    model: db.Category,
    as: "category",
    attributes: ["id", "name", "description"],
  },
  {
    model: db.MuscleGroup,
    as: "muscleGroups",
    through: { attributes: ["is_primary"] },
    attributes: ["id", "name"],
  },
  {
    model: db.User,
    as: "creator",
    attributes: ["id", "name", "email"],
  },
];

const assertExercisePermission = (exercise, user) => {
  if (exercise.created_by !== user.id && user.role?.name !== "ADMIN") {
    throw new ForbiddenError("Bạn không có quyền sửa đổi bài tập này");
  }
};

const validateCategoryAndMuscles = async (payload) => {
  if (payload.category_id !== undefined) {
    const category = await db.Category.findByPk(payload.category_id);
    if (!category) {
      throw new NotFoundError("Không tìm thấy danh mục");
    }
  }

  if (payload.muscle_group_ids !== undefined) {
    const muscleGroups = await db.MuscleGroup.findAll({
      where: { id: payload.muscle_group_ids },
    });

    if (muscleGroups.length !== payload.muscle_group_ids.length) {
      throw new NotFoundError("Một hoặc nhiều nhóm cơ không tồn tại");
    }
  }
};

const syncExerciseMuscles = async (exerciseId, muscleGroupIds, transaction) => {
  await db.ExerciseMuscle.destroy({
    where: { exercise_id: exerciseId },
    transaction,
  });

  if (!muscleGroupIds?.length) {
    return;
  }

  await db.ExerciseMuscle.bulkCreate(
    muscleGroupIds.map((muscleGroupId, index) => ({
      exercise_id: exerciseId,
      muscle_group_id: muscleGroupId,
      is_primary: index === 0,
    })),
    { transaction },
  );
};

const getExerciseById = async (id) => {
  const exercise = await db.Exercise.findByPk(id, {
    include: exerciseInclude,
  });

  if (!exercise) {
    throw new NotFoundError("Không tìm thấy bài tập");
  }

  return exercise;
};

export const getAllExercises = async () => {
  return db.Exercise.findAll({
    include: exerciseInclude,
    order: [["name", "ASC"]],
  });
};

export const createNewExercise = async (payload, userId) => {
  await validateCategoryAndMuscles(payload);

  const transaction = await db.sequelize.transaction();
  try {
    const { muscle_group_ids, ...exerciseData } = payload;

    const exercise = await db.Exercise.create(
      {
        ...exerciseData,
        created_by: userId,
      },
      { transaction },
    );

    await syncExerciseMuscles(exercise.id, muscle_group_ids, transaction);

    await transaction.commit();
    return getExerciseById(exercise.id);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

export const updateInfoExercise = async (id, data, user) => {
  const exercise = await db.Exercise.findByPk(id);
  if (!exercise) {
    throw new NotFoundError("Không tìm thấy bài tập");
  }

  assertExercisePermission(exercise, user);
  await validateCategoryAndMuscles(data);

  const transaction = await db.sequelize.transaction();
  try {
    const { muscle_group_ids, ...exerciseData } = data;

    if (Object.keys(exerciseData).length > 0) {
      await exercise.update(exerciseData, { transaction });
    }

    if (muscle_group_ids !== undefined) {
      await syncExerciseMuscles(exercise.id, muscle_group_ids, transaction);
    }

    await transaction.commit();
    return getExerciseById(exercise.id);
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};

export const deleteExerciseById = async (id, user) => {
  const exercise = await db.Exercise.findByPk(id);
  if (!exercise) {
    throw new NotFoundError("Không tìm thấy bài tập");
  }

  assertExercisePermission(exercise, user);
  await db.Exercise.destroy({ where: { id: exercise.id } });
};

const getWorkoutForMutation = async (userId, workoutId) => {
  const workout = await db.Workout.findOne({
    where: {
      id: workoutId,
      user_id: userId,
    },
  });

  if (!workout) {
    throw new NotFoundError("Không tìm thấy bài tập");
  }

  if (workout.status === WORKOUT_STATUS.COMPLETED) {
    throw new ValidationError("Không thể sửa đổi các bài tập đã hoàn thành");
  }

  return workout;
};

const checkDataBeforeUse = async (user, params, data, isUpdate = false) => {
  const { workoutId, exerciseId } = params;

  const exercise = await db.Exercise.findByPk(exerciseId);
  if (!exercise) {
    throw new NotFoundError("Không tìm thấy bài tập");
  }

  const workout = await getWorkoutForMutation(user.id, workoutId);

  const existingWorkoutExercise = await db.WorkoutExercise.findOne({
    where: {
      workout_id: workout.id,
      exercise_id: exercise.id,
    },
  });

  if (!isUpdate && existingWorkoutExercise) {
    throw new ValidationError("Bài tập đã tồn tại trong buổi tập này");
  }

  if (isUpdate && !existingWorkoutExercise) {
    throw new NotFoundError("Không tìm thấy bài tập thể dục");
  }

  return { workout, exercise, cleanData: data };
};

export const addExerciseToWorkoutById = async (user, params, data) => {
  const { workout, exercise, cleanData } = await checkDataBeforeUse(user, params, data, false);

  await db.WorkoutExercise.create({
    ...data,
    workout_id: workout.id,
    exercise_id: exercise.id,
  });
};

export const updateExerciseToWorkoutById = async (user, params, data) => {
  const { workout, exercise, cleanData } = await checkDataBeforeUse(user, params, data, true);

  await db.WorkoutExercise.update(cleanData, {
    where: {
      workout_id: workout.id,
      exercise_id: exercise.id,
    },
  });
};

export const removeExerciseToWorkoutById = async (user, params) => {
  const { workoutId, workoutExerciseId } = params;

  await getWorkoutForMutation(user.id, workoutId);

  const workoutExercise = await db.WorkoutExercise.findOne({
    where: {
      id: workoutExerciseId,
      workout_id: workoutId,
    },
  });

  if (!workoutExercise) {
    throw new NotFoundError("Không tìm thấy bài tập thể dục");
  }

  await db.WorkoutExercise.destroy({
    where: {
      id: workoutExercise.id,
      workout_id: workoutId,
    },
  });
};
