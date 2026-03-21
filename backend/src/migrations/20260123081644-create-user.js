'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password_hash: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      tokenVersion: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      role_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        references: {
          model: 'Role',
          key: 'id'
        },
      },
      weight: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 70.00
      },
      height: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 170.00
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        defaultValue: 'male'
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};