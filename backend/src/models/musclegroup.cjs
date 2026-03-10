'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MuscleGroup extends Model {
    static associate(models) {
      MuscleGroup.belongsToMany(models.Exercise, {
        through: models.ExerciseMuscle,
        foreignKey: 'muscle_group_id',
        otherKey: 'exercise_id',
        as: 'exercises'
      });
    }
  }
  MuscleGroup.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'MuscleGroup',
    tableName: 'muscle_group',
    timestamps: false
  });
  return MuscleGroup;
};