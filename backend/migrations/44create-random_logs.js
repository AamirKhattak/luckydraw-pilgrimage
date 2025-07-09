
// Migration: create-random_logs.js
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('random_logs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      draw_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'draw_types', key: 'id' },
        onDelete: 'CASCADE'
      },
      generated_number: { type: Sequelize.STRING, allowNull: false },
      matched_employee: { type: Sequelize.BOOLEAN, defaultValue: false },
      matched_employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'employees', key: 'id' },
        onDelete: 'SET NULL'
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('random_logs');
  }
};
