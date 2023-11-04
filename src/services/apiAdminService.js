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
          {
            model: db.DetailCombo,
            as: "detailListUser",
            include: [
              {
                model: db.CornWater,
                as: "detailCornWater",
              },
            ],
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
        where: {
          status: 1,
        },
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

const getAllShowTimesCancel = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ShowTime.findAll({
        where: {
          status: 0,
        },
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

const cancelOneShowTime = ({ filmId, roomId, startDate, startTime }) => {
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
      await showTime.update({ status: 0 });
      resolve({
        errCode: 0,
        errMessage: "Hủy lịch chiếu thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getOneShowTime = ({ filmId, roomId, startDate, startTime }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const showTime = await db.ShowTime.findOne({
        where: {
          filmId,
          roomId,
          startTime,
          startDate,
        },
        include: {
          model: db.Room,
          as: "roomShowTime",
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
      resolve({
        errCode: 0,
        errMessage: "Thành công!",
        data: showTime,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getRoomId = ({ filmId, startDate, startTime }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const showTime = await db.ShowTime.findOne({
        where: {
          filmId,
          startTime,
          startDate,
        },
      });
      if (!showTime) {
        resolve({
          errCode: 2,
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Thành công!",
        data: showTime,
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

const updateCurrUser = async ({
  filmId,
  roomId,
  startDate,
  startTime,
  currUser,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const showTime = await db.ShowTime.findOne({
        where: {
          filmId: filmId,
          roomId: roomId,
          startDate: startDate,
          startTime: startTime,
        },
      });

      if (!showTime) {
        return resolve({
          errCode: 1,
          errMessage: `Lịch chiếu không tồn tại`,
        });
      }
      await showTime.update({ currUser });
      resolve({
        errCode: 0,
        errMessage: showTime,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateStatusListUsers = async ({
  filmId,
  roomId,
  startDate,
  startTime,
}) => {
  return new Promise(async (resolve, reject) => {
    if (!filmId || !roomId || !startDate || !startTime) {
      return {
        errCode: 2,
        errMessage: `Thiếu tham số truyền vào`,
      };
    }
    try {
      const listUsers = await db.ListUser.findAll({
        where: {
          filmId: filmId,
          roomId: roomId,
          startDate: startDate,
          startTime: startTime,
        },
        // raw: true,
        // nest: true,
      });
      if (!listUsers) {
        return resolve({
          errCode: 1,
          errMessage: `Không tìm thấy kết quả`,
        });
      }
      await listUsers.forEach((element) => {
        element.update({ status: 0 });
      });
      resolve({
        errCode: 0,
        errMessage: "Thành công",
        data: listUsers,
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
  cancelOneShowTime,
  getAllRoom,
  getRoomById,
  createShowTime,
  getOneShowTime,
  updateCurrUser,
  getRoomId,
  updateStatusListUsers,
  getAllShowTimesCancel,
};
