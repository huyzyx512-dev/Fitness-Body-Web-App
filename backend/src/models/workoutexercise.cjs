'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkoutExercise extends Model {
    static associate(models) {
      WorkoutExercise.belongsTo(models.Workout, {
        foreignKey: 'workout_id',
        as: 'workout'
      });

      WorkoutExercise.belongsTo(models.Exercise, {
        foreignKey: 'exercise_id',
        as: 'exercise'
      });
    }
  }
  WorkoutExercise.init({
    sets: DataTypes.INTEGER,
    reps: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL,
    comment: DataTypes.TEXT,
    workout_id: DataTypes.INTEGER,
    exercise_id: DataTypes.INTEGER,
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rest_time_seconds: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    }
  }, {
    sequelize,
    modelName: 'WorkoutExercise',
    tableName: 'WorkoutExercise',
  });
  return WorkoutExercise;
};