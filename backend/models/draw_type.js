// models/draw_type.js
module.exports = (sequelize, DataTypes) => {
  const DrawType = sequelize.define('DrawType', {
    yearFrom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'year_from',
    },
    yearTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'year_to',
    },
    drawNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'draw_no',
    },
    type: {
      type: DataTypes.ENUM('hajj', 'umrah'),
      allowNull: false,
    },
    winners: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    waiting: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'draw_types',
    underscored: true,
    timestamps: true,
  });

  DrawType.associate = (models) => {
    DrawType.hasMany(models.DrawResult, { foreignKey: 'draw_type_id' });
    DrawType.hasMany(models.RandomLog, { foreignKey: 'draw_type_id' });
  };

  return DrawType;
};
