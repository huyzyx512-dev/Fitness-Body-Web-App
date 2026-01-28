'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkoutLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
  });
  return WorkoutLog;
};