'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkoutLog extends Model {
    static associate(models) {
      WorkoutLog.belongsTo(models.Workout, {
        foreignKey: 'workout_id',
        as: 'workout'
      });
    }
  }
  WorkoutLog.init({
    completed_at: DataTypes.DATE,
    duration_minutes: DataTypes.INTEGER,
    calories_burned: DataTypes.INTEGER,
    workout_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'WorkoutLog',
    tableName: 'WorkoutLog',
  });
  return WorkoutLog;
};