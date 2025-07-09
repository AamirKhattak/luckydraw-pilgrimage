module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employees', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      employee_number: { type: Sequelize.STRING, allowNull: false, unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      designation: Sequelize.STRING,
      department: Sequelize.STRING,
      location: Sequelize.STRING,
      data_for: { type: Sequelize.ENUM('hajj', 'umrah', 'dharmic', 'holy'), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.fn('now') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('employees');
  }
};
