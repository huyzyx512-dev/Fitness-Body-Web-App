'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBodyLog extends Model {
    static associate(models) {
      UserBodyLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  UserBodyLog.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    body_fat_percentage: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true
    },
    recorded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'UserBodyLog',
    tableName: 'UserBodyLog',
  });
  return UserBodyLog;
};
