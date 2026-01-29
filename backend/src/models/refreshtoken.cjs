'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }
  RefreshToken.init({
    token: DataTypes.STRING,
    expiryDate: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    tokenVersion: DataTypes.INTEGER 
  }, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'RefreshToken',
  });
  return RefreshToken;
};