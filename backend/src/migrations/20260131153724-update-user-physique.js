'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('User', 'weight', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 70.00,
        comment: 'Cân nặng (kg)'
      }, { transaction });

      await queryInterface.addColumn('User', 'height', {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 170.00,
        comment: 'Chiều cao (cm)'
      }, { transaction });

      await queryInterface.addColumn('User', 'gender', {
        type: Sequelize.ENUM('male', 'female', 'other'),
        defaultValue: 'male'
      }, { transaction });

      await queryInterface.addColumn('User', 'date_of_birth', {
        type: Sequelize.DATEONLY, // Chỉ lưu ngày tháng năm
        allowNull: true
      }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('User', 'weight', { transaction });
      await queryInterface.removeColumn('User', 'height', { transaction });
      await queryInterface.removeColumn('User', 'gender', { transaction });
      await queryInterface.removeColumn('User', 'date_of_birth', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};