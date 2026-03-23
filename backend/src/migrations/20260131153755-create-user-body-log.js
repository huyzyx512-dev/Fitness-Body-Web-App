'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
          references: {
            model: 'user', // Tên bảng tham chiếu
            key: 'id'
          },
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
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction });

      // Tạo Index để query lịch sử nhanh hơn
      await queryInterface.addIndex('UserBodyLog', ['user_id'], { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    // Khi rollback thì drop bảng này
    await queryInterface.dropTable('UserBodyLog');
  }
};