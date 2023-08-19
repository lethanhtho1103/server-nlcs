"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "user",
      });
      User.hasMany(models.ListUser, {
        foreignKey: "userId",
        as: "userFilm",
      });
    }
  }
  User.init(
    {
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
