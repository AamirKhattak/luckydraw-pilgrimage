module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('draw_types', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      year: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.ENUM('hajj', 'umrah', 'dharmic', 'holy'), allowNull: false },
      winners: { type: Sequelize.INTEGER, allowNull: false },
      waiting: { type: Sequelize.INTEGER, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('draw_types');
  }
};