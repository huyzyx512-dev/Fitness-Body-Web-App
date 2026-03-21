'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable('UserBodyLog');
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('UserBodyLog', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'User', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        weight: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: false
        },
        height: {
          type: Sequelize.DECIMAL(5, 2),
          allowNull: true
        },
        body_fat_percentage: {
          type: Sequelize.DECIMAL(4, 1),
          allowNull: true
        },
        recorded_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        createdAt: { allowNull: false, type: Sequelize.DATE },
        updatedAt: { allowNull: false, type: Sequelize.DATE }
      }, { transaction });

      await queryInterface.addIndex('UserBodyLog', ['user_id'], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
