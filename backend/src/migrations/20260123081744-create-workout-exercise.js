'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WorkoutExercise', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sets: {
        type: Sequelize.INTEGER
      },
      reps: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.DECIMAL
      },
      comment: {
        type: Sequelize.TEXT
      },
      workout_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Workout',
          key: 'id'
        },
        onDelete: 'CASCADE',

      },
      exercise_id: {
        type: Sequelize.INTEGER,
        onUpdate: 'CASCADE',
        references: {
          model: 'Exercise',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
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
    await queryInterface.dropTable('WorkoutExercise');
  }
};