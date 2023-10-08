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
      Film.hasMany(models.ShowTime, {
        foreignKey: "filmId",
        as: "filmShowTime",
      });
    }
  }
  Film.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      backgroundImage: DataTypes.STRING,
      type: DataTypes.STRING,
      origin: DataTypes.STRING,
      title: DataTypes.STRING,
      startDate: DataTypes.DATE,
      totalTime: DataTypes.INTEGER,
      ageAllowed: DataTypes.INTEGER,
      trailer: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Film",
    }
  );
  return Film;
};
