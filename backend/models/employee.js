// models/employee.js
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    employee_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: DataTypes.STRING,
    department: DataTypes.STRING,
    location: DataTypes.STRING,
    cnic: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    data_for: {
      type: DataTypes.ENUM('hajj', 'umrah', 'dharmic', 'holy'),
      allowNull: false,
    }
  }, {
    tableName: 'employees',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['employee_number', 'data_for']
      }
    ]
  });

  Employee.associate = (models) => {
    Employee.hasMany(models.DrawResult, { foreignKey: 'employee_id' });
    Employee.hasMany(models.RandomLog, { foreignKey: 'matched_employee_id' });
  };

  return Employee;
};
