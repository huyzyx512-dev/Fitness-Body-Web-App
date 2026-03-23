'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Exercise', 'met_value', {
        type: Sequelize.DECIMAL(4, 1),
        defaultValue: 3.0,
        comment: 'Chỉ số MET để tính calories'
      }, { transaction });

      await queryInterface.addColumn('Exercise', 'difficulty_level', {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner'
      }, { transaction });

      await queryInterface.addColumn('Exercise', 'equipment', {
        type: Sequelize.STRING,
        defaultValue: 'none',
        comment: 'Dụng cụ: dumbbell, barbell...'
      }, { transaction });

      await queryInterface.addColumn('Exercise', 'video_url', {
        type: Sequelize.STRING(500),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('Exercise', 'thumbnail_url', {
        type: Sequelize.STRING(500),
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
      await queryInterface.removeColumn('Exercise', 'met_value', { transaction });
      await queryInterface.removeColumn('Exercise', 'difficulty_level', { transaction });
      await queryInterface.removeColumn('Exercise', 'equipment', { transaction });
      await queryInterface.removeColumn('Exercise', 'video_url', { transaction });
      await queryInterface.removeColumn('Exercise', 'thumbnail_url', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};