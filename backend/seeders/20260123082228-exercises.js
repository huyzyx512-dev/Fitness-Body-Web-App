'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // `Exercises.id` is INTEGER auto-increment (see migration), so do not provide `id` values here.
    // `createdAt/updatedAt` are NOT NULL in the migration, so we set them explicitly for bulkInsert.
    const now = new Date();

    await queryInterface.bulkInsert('Exercises', [
      {
        name: 'Bench Press',
        description: 'Chest exercise',
        category: 'strength',
        muscle_group: 'chest',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Squat',
        description: 'Leg exercise',
        category: 'strength',
        muscle_group: 'legs',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Exercises', null, {});
  },
};

