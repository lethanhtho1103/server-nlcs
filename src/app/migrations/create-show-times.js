"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ShowTimes", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      filmId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      roomId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      startDate: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DATE,
      },
      startTime: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      currUser: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ShowTimes");
  },
};
