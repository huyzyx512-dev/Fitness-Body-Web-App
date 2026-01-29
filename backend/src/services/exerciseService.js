import db from '../models/index.js';

export const getAllExercises = async () => {
  return await db.Exercise.findAll({
    order: [['name', 'ASC']]
  });
};

export const createNewExercise = async (name, description, category, muscle_group, userId) => {
  return await db.Exercise.create({
    name, description, category, muscle_group,
    created_by: userId
  });
};

export const updateInfoExercise = async (id, data, user) => {
  const exercise = await db.Exercise.findByPk(id);

  if (!exercise) {
    throw new Error('NOT_FOUND');
  }

  if (
    exercise.created_by !== user.id &&
    user.role.name !== 'ADMIN'
  ) {
    throw new Error('FORBIDDEN');
  }

  return await db.Exercise.update(data, {
    where: { id }
  });
};

export const deleteExerciseById = async (id, user) => {
  const exercise = await db.Exercise.findByPk(id);

  if (!exercise) {
    throw new Error('NOT_FOUND');
  }

  if (
    exercise.created_by !== user.id &&
    user.role.name !== 'ADMIN'
  ) {
    throw new Error('FORBIDDEN');
  }

  await db.Exercise.destroy({ where: { id: exercise.id } });
};
