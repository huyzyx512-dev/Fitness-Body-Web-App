'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Role
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role'
      });

      // Workouts
      User.hasMany(models.Workout, {
        foreignKey: 'user_id',
        as: 'workouts'
      });

      // Custom exercises (Hybrid)
      User.hasMany(models.Exercise, {
        foreignKey: 'created_by',
        as: 'createdExercises'
      });

      // Refresh tokens
      User.hasMany(models.RefreshToken, {
        foreignKey: 'userId',
        as: 'refreshTokens'
      });
    }
  }
  User.init({
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: DataTypes.STRING,
    name: DataTypes.STRING,
    tokenVersion: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User',
  });
  return User;
};