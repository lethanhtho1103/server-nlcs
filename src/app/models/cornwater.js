"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CornWater extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CornWater.hasMany(models.DetailCombo, {
        foreignKey: "cornWaterId",
        as: "detailCombo",
      });
    }
  }
  CornWater.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CornWater",
    }
  );
  return CornWater;
};
