'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Exercise', 'category_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Category', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }, { transaction });

      const [exercises] = await queryInterface.sequelize.query(
        `SELECT DISTINCT category FROM Exercise WHERE category IS NOT NULL`,
        { transaction }
      );

      for (const row of exercises) {
        if (!row.category) continue;
        const now = new Date();
        await queryInterface.sequelize.query(
          `INSERT INTO Category (name, createdAt, updatedAt) VALUES (?, ?, ?)`,
          {
            replacements: [row.category, now, now],
            transaction
          }
        );
        await queryInterface.sequelize.query(
          `UPDATE Exercise SET category_id = (SELECT id FROM Category WHERE name = ? LIMIT 1) WHERE category = ?`,
          { replacements: [row.category, row.category], transaction }
        );
      }

      const [muscleRows] = await queryInterface.sequelize.query(
        `SELECT DISTINCT muscle_group FROM Exercise WHERE muscle_group IS NOT NULL`,
        { transaction }
      );

      for (const row of muscleRows) {
        if (!row.muscle_group) continue;
        const now = new Date();
        await queryInterface.sequelize.query(
          `INSERT INTO Muscle_group (name, createdAt, updatedAt) VALUES (?, ?, ?)`,
          { replacements: [row.muscle_group, now, now], transaction }
        );
      }

      await queryInterface.createTable('Exercise_muscle', {
        exercise_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: { model: 'Exercise', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        muscle_group_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: { model: 'Muscle_group', key: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        is_primary: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          comment: 'Primary muscle marker'
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

      const [exWithMuscle] = await queryInterface.sequelize.query(
        `SELECT id, muscle_group FROM Exercise WHERE muscle_group IS NOT NULL`,
        { transaction }
      );

      for (const ex of exWithMuscle) {
        const now = new Date();
        await queryInterface.sequelize.query(
          `INSERT INTO Exercise_muscle (exercise_id, muscle_group_id, is_primary, createdAt, updatedAt)
           SELECT ?, mg.id, true, ?, ?
           FROM Muscle_group mg WHERE mg.name = ? LIMIT 1`,
          { replacements: [ex.id, now, now, ex.muscle_group], transaction }
        );
      }

      await queryInterface.removeColumn('Exercise', 'muscle_group', { transaction });
      await queryInterface.removeColumn('Exercise', 'category', { transaction });
      await queryInterface.removeColumn('Exercise', 'met_value', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Exercise', 'muscle_group', {
        type: Sequelize.STRING
      }, { transaction });

      await queryInterface.addColumn('Exercise', 'category', {
        type: Sequelize.STRING
      }, { transaction });

      await queryInterface.addColumn('Exercise', 'met_value', {
        type: Sequelize.DECIMAL(4, 1),
        defaultValue: 3.0
      }, { transaction });

      await queryInterface.sequelize.query(`
        UPDATE Exercise e
        JOIN Exercise_muscle em ON em.exercise_id = e.id AND em.is_primary = true
        JOIN Muscle_group mg ON mg.id = em.muscle_group_id
        SET e.muscle_group = mg.name
      `, { transaction });

      await queryInterface.sequelize.query(`
        UPDATE Exercise e
        JOIN Category c ON c.id = e.category_id
        SET e.category = c.name
      `, { transaction });

      await queryInterface.dropTable('Exercise_muscle', { transaction });
      await queryInterface.removeColumn('Exercise', 'category_id', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
