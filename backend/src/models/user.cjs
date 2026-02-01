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

      // Body logs
      User.hasMany(models.UserBodyLog, {
        foreignKey: 'user_id',
        as: 'bodyLogs'
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
    tokenVersion: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    role_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 70.00
    },
    height: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 170.00
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      defaultValue: 'male'
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User',
  });
  return User;
};