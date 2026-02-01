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
    created_by: DataTypes.INTEGER,
    met_value: {
      type: DataTypes.DECIMAL(4, 1),
      defaultValue: 3.0
    },
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