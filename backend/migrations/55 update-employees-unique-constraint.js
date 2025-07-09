// migration: update-employees-unique-constraint.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Remove old unique constraint if it exists
    await queryInterface.removeConstraint('employees', 'employees_employee_number_key').catch(() => {});

    // 2. Add new CNIC column
    await queryInterface.addColumn('employees', 'cnic', {
      type: Sequelize.STRING(13),
      allowNull: true,
    });

    // 3. Add composite unique constraint
    await queryInterface.addConstraint('employees', {
      fields: ['employee_number', 'data_for'],
      type: 'unique',
      name: 'unique_employee_number_per_data_for'
    });
  },

  down: async (queryInterface) => {
    // Revert unique constraint and remove CNIC column
    await queryInterface.removeConstraint('employees', 'unique_employee_number_per_data_for');
    await queryInterface.removeColumn('employees', 'cnic');

    // Optionally restore old unique constraint on employee_number
    await queryInterface.addConstraint('employees', {
      fields: ['employee_number'],
      type: 'unique',
      name: 'employees_employee_number_key'
    });
  }
};
