"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShowTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ShowTime.belongsTo(models.Film, {
        foreignKey: "filmId",
        targetKey: "id",
        as: "filmShowTime",
      });
      ShowTime.belongsTo(models.Room, {
        foreignKey: "roomId",
        targetKey: "id",
        as: "roomShowTime",
      });
    }
  }
  ShowTime.init(
    {
      roomId: DataTypes.STRING,
      filmId: DataTypes.STRING,
      startDate: DataTypes.DATE,
      startTime: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ShowTime",
    }
  );
  return ShowTime;
};
