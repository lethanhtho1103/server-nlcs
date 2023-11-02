"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ListUser.belongsTo(models.Film, {
        foreignKey: "filmId",
        targetKey: "id",
        as: "film",
      });
      ListUser.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "userFilm",
      });
      ListUser.hasMany(models.DetailCombo, {
        foreignKey: "listUserId",
        as: "detailListUser",
      });
    }
  }
  ListUser.init(
    {
      userId: DataTypes.STRING,
      filmId: DataTypes.STRING,
      roomId: DataTypes.STRING,
      startTime: DataTypes.STRING,
      startDate: DataTypes.STRING,
      ticket: DataTypes.INTEGER,
      seat: DataTypes.STRING,
      priceTicket: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      comment: DataTypes.STRING,
      rate: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ListUser",
    }
  );
  return ListUser;
};
