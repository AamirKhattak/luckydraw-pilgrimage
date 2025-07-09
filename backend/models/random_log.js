module.exports = (sequelize, DataTypes) => {
  const RandomLog = sequelize.define('RandomLog', {
    draw_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    generated_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    matched_employee: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    matched_employee_id: DataTypes.INTEGER,
  }, {
    tableName: 'random_logs',
    underscored: true,
    timestamps: true,
  });

  RandomLog.associate = (models) => {
    RandomLog.belongsTo(models.Employee, { foreignKey: 'matched_employee_id' });
    RandomLog.belongsTo(models.DrawType, { foreignKey: 'draw_type_id' });
  };

  return RandomLog;
};
// This model tracks the random numbers generated during the draw process,
// including whether they matched an employee and the associated draw type. 