"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailCombo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailCombo.belongsTo(models.ListUser, {
        foreignKey: "listUserId",
        targetKey: "id",
        as: "detailListUser",
      });
      DetailCombo.belongsTo(models.CornWater, {
        foreignKey: "cornWaterId",
        targetKey: "id",
        as: "detailCornWater",
      });
    }
  }
  DetailCombo.init(
    {
      listUserId: DataTypes.INTEGER,
      cornWaterId: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DetailCombo",
    }
  );
  return DetailCombo;
};
