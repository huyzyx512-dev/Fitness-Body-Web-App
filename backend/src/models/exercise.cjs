'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    static associate(models) {
      Exercise.hasMany(models.WorkoutExercise, {
        foreignKey: 'exercise_id',
        as: 'workoutExercises'
      });

      Exercise.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });
    }
  }
  Exercise.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    muscle_group: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Exercise',
    tableName: 'Exercise'
  });
  return Exercise;
};