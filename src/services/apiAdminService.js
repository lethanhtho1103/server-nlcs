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
        include: [
          {
            model: db.User,
            as: "userFilm",
            attributes: {
              exclude: ["password", "type", "createdAt", "updatedAt"],
            },
          },
        ],
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

const getAllShowTimes = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ShowTime.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: db.Film,
            as: "filmShowTime",
          },
          {
            model: db.Room,
            as: "roomShowTime",
          },
        ],
        order: [["startDate", "DESC"]],
      });

      if (!data) {
        resolve({
          errCode: 2,
          errMessage: `Không tìm thấy kết quả`,
        });
      }

      resolve({
        errCode: 0,
        errMessage: "Ok",
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteOneShowTime = ({ filmId, roomId, startDate, startTime }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const showTime = await db.ShowTime.findOne({
        where: {
          filmId,
          roomId,
          startTime,
          startDate,
        },
      });
      if (!showTime) {
        resolve({
          errCode: 2,
          data: filmId,
          roomId,
          startDate,
          startTime,
          errMessage: "Không tìm thấy kết quả",
        });
      }
      await showTime.destroy();
      resolve({
        errCode: 0,
        errMessage: "Xóa bản ghi thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllRoom = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const listRoom = await db.Room.findAll({
        nest: true,
        raw: true,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!listRoom) {
        resolve({
          errCode: 2,
          errMessage: "Không tìm thấy kết quả",
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Thành công!",
        data: listRoom,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getRoomById = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const room = await db.Room.findByPk(id);
      if (room) {
        resolve({
          errCode: 0,
          errMessage: "Success",
          data: room,
        });
      }

      return resolve({
        errCode: 1,
        errMessage: `Không tìm thấy id (${id}) trong hệ thống`,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createShowTime = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const showTime = await db.ShowTime.create({
        filmId: data.filmId,
        roomId: data.roomId,
        startDate: data.startDate,
        startTime: data.startTime,
      });

      if (showTime) {
        resolve({
          errCode: 0,
          errMessage: "Successfully created!",
          data: showTime,
        });
        resolve({
          errCode: 3,
          errMessage: "Lỗi server!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateShowTime = async ({ userId, filmId, comment, rate }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userFilm = await db.ListUser.findOne({
        where: {
          userId: userId,
          filmId: filmId,
        },
      });

      if (!userFilm) {
        return resolve({
          errCode: 1,
          errMesagge: `Bạn chưa đăng ký bộ phim này = ${id}`,
        });
      }
      await userFilm.update({ comment, rate });
      resolve({
        errCode: 0,
        errMessage: userFilm,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getListUserAndSumTicket,
  getListUserDetailTable,
  getAllShowTimes,
  deleteOneShowTime,
  getAllRoom,
  getRoomById,
  createShowTime,
};
