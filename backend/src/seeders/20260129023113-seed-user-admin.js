'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password_hash = await bcrypt.hash('123456', 10);
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM Role WHERE name = 'ADMIN' LIMIT 1`
    );
    const adminRole = roles[0];
    const now = new Date();

    await queryInterface.bulkInsert('User', [{
      name: 'admin',
      email: 'admin@gmail.com',
      password_hash,
      role_id: adminRole ? adminRole.id : 1,
      gender: 'other',
      createdAt: now,
      updatedAt: now
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('User', { email: 'admin@gmail.com' }, {});
  }
};
