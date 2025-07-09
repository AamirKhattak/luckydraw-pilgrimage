'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('draw_results', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      draw_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'draw_types', key: 'id' },
        onDelete: 'CASCADE'
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'employees', key: 'id' },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('winner', 'waiting'),
        allowNull: false
      },
      position: { type: Sequelize.INTEGER, allowNull: false },
      random_number_used: Sequelize.STRING,
      drawn_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('draw_results');
  }
};
