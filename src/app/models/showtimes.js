"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShowTimes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShowTimes.belongsTo(models.Film, {
        foreignKey: "filmId",
        targetKey: "id",
        as: "filmShowTimes",
      });
      ShowTimes.belongsTo(models.Room, {
        foreignKey: "roomId",
        targetKey: "id",
        as: "roomShowTimes",
      });
    }
  }
  ShowTimes.init(
    {
      roomId: DataTypes.STRING,
      filmId: DataTypes.STRING,
      startTime: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ShowTimes",
    }
  );
  return ShowTimes;
};
