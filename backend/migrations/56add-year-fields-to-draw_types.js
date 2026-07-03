module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('draw_types', 'year_from', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('draw_types', 'year_to', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('draw_types', 'year_from');
    await queryInterface.removeColumn('draw_types', 'year_to');
  },
};
