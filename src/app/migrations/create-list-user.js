"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ListUsers", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      filmId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      roomId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cornWaterId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      ticket: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      priceTicket: {
        type: Sequelize.INTEGER,
      },
      quantityCombo: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      startTime: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.STRING,
      },
      comment: {
        type: Sequelize.STRING,
      },
      rate: {
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
    await queryInterface.dropTable("ListUsers");
  },
};
