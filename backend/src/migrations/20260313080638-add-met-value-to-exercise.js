'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Exercise', 'met_value', {
      type: Sequelize.DECIMAL(4, 1),
      defaultValue: 3.0,
      allowNull: false,
      comment: 'Chỉ số MET để tính calories: calories = MET × weight(kg) × duration(hours)'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Exercise', 'met_value');
  }
};