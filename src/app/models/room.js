"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.hasMany(models.ShowTime, {
        foreignKey: "roomId",
        as: "roomShowTime",
      });
    }
  }
  Room.init(
    {
      maxUser: DataTypes.INTEGER,
      priceTicket: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
