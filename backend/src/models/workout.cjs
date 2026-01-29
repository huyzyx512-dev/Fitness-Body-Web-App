'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Workout extends Model {
    static associate(models) {
      Workout.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Workout.hasMany(models.WorkoutExercise, {
        foreignKey: 'workout_id',
        as: 'exercises',
        onDelete: 'CASCADE'
      });

      Workout.hasOne(models.WorkoutLog, {
        foreignKey: 'workout_id',
        as: 'log',
        onDelete: 'CASCADE'
      });
    }
  }
  Workout.init({
    title: DataTypes.STRING,
    notes: DataTypes.TEXT,
    scheduled_at: DataTypes.DATE,
    status: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Workout',
    tableName: 'Workout',
  });
  return Workout;
};