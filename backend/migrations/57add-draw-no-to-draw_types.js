module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('draw_types', 'draw_no', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('draw_types', 'draw_no');
  },
};
