'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Thêm dữ liệu vào bảng Roles
    return queryInterface.bulkInsert('Role', [
      {
        name: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'COACH',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // Xóa dữ liệu khi rollback
    return queryInterface.bulkDelete('Role', null, {});
  }
};
