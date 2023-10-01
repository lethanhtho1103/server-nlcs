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
    }
  }
  ListUser.init(
    {
      userId: DataTypes.STRING,
      filmId: DataTypes.STRING,
      status: DataTypes.STRING,
      ticket: DataTypes.INTEGER,
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
