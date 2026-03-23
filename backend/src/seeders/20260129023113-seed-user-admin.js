'use strict';
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password_hash = bcrypt.hash('123456', 10)
    await queryInterface.bulkInsert('User', [{
      name: 'admin',
      email: 'admin@gmail.com',
      password: password_hash,
    }], {});
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('User', null, {});

  }
};
