'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WorkoutLog', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      completed_at: {
        type: Sequelize.DATE
      },
      duration_minutes: {
        type: Sequelize.INTEGER
      },
      calories_burned: {
        type: Sequelize.INTEGER
      },
      workout_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Workout',
          key: 'id'
        },
      },
      comment: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WorkoutLog');
  }
};