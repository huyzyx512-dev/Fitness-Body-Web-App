'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Category', [
      { name: 'strength', description: 'Strength training', createdAt: now, updatedAt: now },
      { name: 'cardio', description: 'Cardio training', createdAt: now, updatedAt: now },
      { name: 'flexibility', description: 'Flexibility training', createdAt: now, updatedAt: now }
    ], {});

    await queryInterface.bulkInsert('Muscle_group', [
      { name: 'chest', createdAt: now, updatedAt: now },
      { name: 'legs', createdAt: now, updatedAt: now },
      { name: 'full_body', createdAt: now, updatedAt: now }
    ], {});

    const [categoryRows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM Category WHERE name IN ('strength', 'cardio', 'flexibility')`
    );
    const [muscleRows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM Muscle_group WHERE name IN ('chest', 'legs', 'full_body')`
    );

    const categoryMap = Object.fromEntries(categoryRows.map((row) => [row.name, row.id]));
    const muscleMap = Object.fromEntries(muscleRows.map((row) => [row.name, row.id]));

    await queryInterface.bulkInsert('Exercise', [
      {
        name: 'Bench Press',
        description: 'Barbell chest press for chest and triceps strength.',
        category_id: categoryMap.strength,
        met_value: 5.0,
        difficulty_level: 'intermediate',
        equipment: 'Barbell, Bench',
        video_url: 'https://youtube.com/watch?v=benchpress_demo',
        thumbnail_url: null,
        created_by: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Squat',
        description: 'Compound lower body movement focused on legs and glutes.',
        category_id: categoryMap.strength,
        met_value: 6.0,
        difficulty_level: 'advanced',
        equipment: 'Barbell, Rack',
        video_url: 'https://youtube.com/watch?v=squat_demo',
        thumbnail_url: null,
        created_by: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Treadmill Running',
        description: 'Moderate treadmill running for cardio endurance.',
        category_id: categoryMap.cardio,
        met_value: 9.0,
        difficulty_level: 'beginner',
        equipment: 'Treadmill',
        video_url: null,
        thumbnail_url: null,
        created_by: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Yoga Basic Flow',
        description: 'A gentle yoga flow for flexibility and recovery.',
        category_id: categoryMap.flexibility,
        met_value: 3.0,
        difficulty_level: 'beginner',
        equipment: 'Yoga Mat',
        video_url: null,
        thumbnail_url: null,
        created_by: null,
        createdAt: now,
        updatedAt: now,
      }
    ], {});

    const [exerciseRows] = await queryInterface.sequelize.query(
      `SELECT id, name FROM Exercise WHERE name IN ('Bench Press', 'Squat', 'Treadmill Running', 'Yoga Basic Flow')`
    );

    const exerciseMap = Object.fromEntries(exerciseRows.map((row) => [row.name, row.id]));

    await queryInterface.bulkInsert('Exercise_muscle', [
      {
        exercise_id: exerciseMap['Bench Press'],
        muscle_group_id: muscleMap.chest,
        is_primary: true,
        createdAt: now,
        updatedAt: now
      },
      {
        exercise_id: exerciseMap.Squat,
        muscle_group_id: muscleMap.legs,
        is_primary: true,
        createdAt: now,
        updatedAt: now
      },
      {
        exercise_id: exerciseMap['Treadmill Running'],
        muscle_group_id: muscleMap.legs,
        is_primary: true,
        createdAt: now,
        updatedAt: now
      },
      {
        exercise_id: exerciseMap['Yoga Basic Flow'],
        muscle_group_id: muscleMap.full_body,
        is_primary: true,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Exercise_muscle', null, {});
    await queryInterface.bulkDelete('Exercise', null, {});
    await queryInterface.bulkDelete('Muscle_group', null, {});
    await queryInterface.bulkDelete('Category', null, {});
  },
};
