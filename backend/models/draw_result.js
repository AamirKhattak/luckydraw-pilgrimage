module.exports = (sequelize, DataTypes) => {
  const DrawResult = sequelize.define('DrawResult', {
    draw_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('winner', 'waiting'),
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    random_number_used: DataTypes.STRING,
    drawn_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'draw_results',
    underscored: true,
    timestamps: true,
  });

  DrawResult.associate = (models) => {
    DrawResult.belongsTo(models.Employee, { foreignKey: 'employee_id' });
    DrawResult.belongsTo(models.DrawType, { foreignKey: 'draw_type_id' });
  };

  return DrawResult;
};
