const Sequelize = require("sequelize");
const db = require("../app/models");

const getListUserAndSumTicket = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ListUser.findAll({
        // where: {
        //   filmId,
        //   startTime,
        //   startDate,
        // },
        attributes: {
          include: [
            [Sequelize.fn("SUM", Sequelize.col("ticket")), "totalTicket"],
          ],
        },
        raw: true,
        nest: true,
        include: [
          {
            model: db.Film,
            as: "film",
            attributes: {
              exclude: [
                "backgroundImage",
                "filmId",
                "type",
                "origin",
                "title",
                "trailer",
                "content",
                "avgRate",
                "createdAt",
                "updatedAt",
                "startDate",
                "image",
                "totalTime",
                "ageAllowed",
              ],
            },
          },
        ],
        group: ["filmId", "startTime", "startDate"],
        order: ["filmId", "startTime", "startDate"],
      });

      if (data) {
        resolve({
          errCode: 0,
          errMessage: "",
          data: data,
        });
      }

      resolve({
        errCode: 1,
        errMessage: "Lỗi apiService tại backend",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getListUserDetailTable = ({ filmId, startTime, startDate }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const listFilm = await db.ListUser.findAll({
        where: {
          filmId,
          startTime,
          startDate,
        },
        nest: true,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        // include: [
        //   {
        //     model: db.Film,
        //     as: "film",
        //     attributes: {
        //       exclude: [
        //         "backgroundImage",
        //         "filmId",
        //         "type",
        //         "origin",
        //         "title",
        //         "trailer",
        //         "content",
        //         "avgRate",
        //         "createdAt",
        //         "updatedAt",
        //         "startDate",
        //       ],
        //     },

        //     include: [
        //       {
        //         model: db.ShowTime,
        //         as: "filmShowTime",
        //         attributes: {
        //           exclude: ["id", "filmId", "createdAt", "updatedAt"],
        //         },

        //         include: [
        //           {
        //             model: db.Room,
        //             as: "roomShowTime",
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   {
        //     model: db.User,
        //     as: "userFilm",
        //     attributes: {
        //       exclude: ["type", "createdAt", "updatedAt"],
        //     },
        //   },
        // ],
      });
      if (!listFilm) {
        resolve({
          errCode: 2,
          errMessage: "Không tìm thấy kết quả",
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Thành công!",
        data: listFilm,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getListUserAndSumTicket, getListUserDetailTable };
