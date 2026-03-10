'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    static associate(models) {
      Exercise.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'creator'
      });

      Exercise.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      Exercise.belongsToMany(models.MuscleGroup, {
        through: models.ExerciseMuscle,
        foreignKey: 'exercise_id',
        otherKey: 'muscle_group_id',
        as: 'muscleGroups'
      });

      Exercise.hasMany(models.ExerciseMuscle, {
        foreignKey: 'exercise_id',
        as: 'exerciseMuscles'
      });

      Exercise.hasMany(models.WorkoutExercise, {
        foreignKey: 'exercise_id',
        as: 'workoutExercises'
      });
    }
  }
  Exercise.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: DataTypes.INTEGER,
    difficulty_level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      defaultValue: 'beginner'
    },
    equipment: {
      type: DataTypes.STRING,
      defaultValue: 'none'
    },
    video_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    thumbnail_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Exercise',
    tableName: 'Exercise'
  });
  return Exercise;
};