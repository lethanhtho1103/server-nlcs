"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Films", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.DATE,
        validate: {
          checkStartDate(value) {
            if (value <= new Date()) {
              throw new Error("Ngày bắt đầu phải là ngày trong tương lai!");
            }
          },
        },
      },
      maxUser: {
        type: Sequelize.INTEGER,
      },
      curUser: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          checkCurUser(value) {
            if (value > this.maxUser) {
              throw new Error("Số lượng hiện tại đã đạt tối đa!");
            }
          },
        },
      },
      price: {
        type: Sequelize.INTEGER,
      },
      room: {
        type: Sequelize.STRING,
      },
      videoReview: {
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Films");
  },
};
