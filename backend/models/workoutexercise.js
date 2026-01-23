'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkoutExercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WorkoutExercise.init({
    sets: DataTypes.INTEGER,
    reps: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL,
    comment: DataTypes.TEXT,
    workout_id: DataTypes.UUID,
    exercise_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'WorkoutExercise',
  });
  return WorkoutExercise;
};