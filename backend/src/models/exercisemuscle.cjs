'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExerciseMuscle extends Model {
    static associate(models) {
      ExerciseMuscle.belongsTo(models.Exercise, {
        foreignKey: 'exercise_id',
        as: 'exercise'
      });
      ExerciseMuscle.belongsTo(models.MuscleGroup, {
        foreignKey: 'muscle_group_id',
        as: 'muscleGroup'
      });
    }
  }
  ExerciseMuscle.init({
    exercise_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    muscle_group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Nhóm cơ chính hay phụ'
    }
  }, {
    sequelize,
    modelName: 'ExerciseMuscle',
    tableName: 'exercise_muscle',
    timestamps: false
  });
  return ExerciseMuscle;
};