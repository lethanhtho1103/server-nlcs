"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Film extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Film.hasMany(models.ListUser, {
        foreignKey: "filmId",
        as: "film",
      });
    }
  }
  Film.init(
    {
      name: DataTypes.STRING,
      startDate: DataTypes.DATE,
      room: DataTypes.STRING,
      maxStudent: DataTypes.INTEGER,
      curStudent: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      note: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Film",
    }
  );
  return Film;
};
