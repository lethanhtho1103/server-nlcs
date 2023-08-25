const { v4: uuidv4 } = require("uuid");
const db = require("../app/models/");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");

const getFilmReg = ({
  isChecked,
  id,
  userId,
  limit,
  typeTimeFilm = "Doing",
}) => {
  const conditions = {
    where: {
      status: isChecked ? 1 : 0,
    },
  };
  if (userId) {
    conditions.where.userId = userId;
    if (limit) {
      conditions.limit = limit;
    }
  }
  const conditionFilm = {};
  if (id) {
    conditionFilm.where = {
      id,
    };
  }
  if (typeTimeFilm === "Doing") {
    // // if (conditionFilm?.where) {
    // //   conditionFilm.where.startDate = { [Op.gte]: new Date() };
    // // }
    // //  else {
    // conditionFilm.where = {
    //   startDate: { [Op.gte]: new Date() },
    // };
    // // }
  }
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ListUser.findAll({
        ...conditions,
        raw: true,
        nest: true,
        attributes: {
          exclude: ["userId", "filmId"],
        },
        separate: true,
        include: [
          {
            model: db.User,
            as: "userFilm",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: db.Film,
            as: "film",
            ...conditionFilm,
          },
        ],
        order: [
          [
            {
              model: db.film,
            },
            "startDate",
            "ASC",
          ],
        ],
      });
      if (data.length > 0) {
        resolve({
          errCode: 0,
          errMessage: "",
          data: data,
        });
        resolve({
          errCode: 1,
          errMessage: "Không có bản ghi nào phù hợp!",
          data: [],
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getFilm = ({ filmId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!filmId) {
        resolve({
          errCode: 1,
          errMessage: `film trống!`,
        });
      }

      const data = await db.Film.findOne({
        where: {
          id: filmId,
        },
        raw: true,
      });

      if (!data) {
        resolve({
          errCode: 2,
          errMessage: `Không tìm thấy bộ phim có id = ${filmId} `,
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

const getFilmAndCountRequest = ({ filmId }) => {
  const conditions = {
    where: {
      status: 0,
    },
  };

  const conditionFilm = {};
  if (filmId) {
    conditionFilm.where = {
      id: filmId,
    };
  }

  if (conditionFilm?.where) {
    conditionFilm.where.startDate = { [Op.gte]: new Date() };
  } else {
    conditionFilm.where = {
      startDate: { [Op.gte]: new Date() },
    };
  }

  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ListUser.findAll({
        ...conditions,
        raw: true,
        nest: true,
        attributes: {
          include: [
            [Sequelize.fn("COUNT", Sequelize.col("userFilm.id")), "filmCount"],
          ],
          exclude: ["userId", "filmId"],
        },
        group: ["film.id"],
        // separate: true,
        include: [
          {
            model: db.User,
            as: "userFilm",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
          {
            model: db.Film,
            as: "film",
            ...conditionFilm,
          },
        ],
        order: [
          [
            {
              model: db.film,
            },
            "startDate",
            "ASC",
          ],
        ],
      });

      if (data) {
        resolve({
          errCode: 0,
          errMessage: "",
          films: data,
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

const filmBrowse = (id, req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const film = await db.ListUser.findOne({
        where: {
          id,
        },
      });
      if (!film) {
        resolve({
          errCode: 2,
          errMessage: "Không có bộ phim này!",
        });
      }

      await film.set({
        status: req,
      });

      const res = await film.save();
      if (res) {
        const result = await db.Film.findOne({
          where: {
            id: film.dataValues.filmId,
          },
        });
        if (!result) {
          resolve({
            errCode: 3,
            errMessage: "Không có bộ phim này trong bảng Film",
          });
        }

        const resultFilm = await result.increment("curUser", {
          by: 1,
        });
        if (resultFilm) {
          resolve({
            errCode: 0,
            errMessage: "",
          });
        } else {
          resolve({
            errCode: 5,
            errMessage: "Lỗi Film",
          });
        }
      }
      resolve({
        errCode: 4,
        errMessage: "Lỗi server 500",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createFilm = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (new Date(data.startDate) <= new Date()) {
        return resolve({
          errCode: 2,
          errMessage: "Ngày bắt đầu bộ phim phải là ngày trong tương lai",
        });
      }

      const film = await db.Film.create({
        id: uuidv4(),
        name: data.name,
        videoReview: data.videoReview ? data.videoReview : null,
        room: data.room,
        startDate: data.startDate,
        maxUser: data.maxUser,
        price: data.price,
        note: data.note ? data.note : null,
      });

      if (film) {
        resolve({
          errCode: 0,
          errMessage: "Successfully created!",
          data: film,
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

const registerFilm = (filmId, userId, ticket) => {
  return new Promise(async (resolve, reject) => {
    // Kiểm tra xem bộ phim và người dùng có tồn tại hay không ?
    const film = db.Film.findOne({
      where: {
        id: filmId,
      },
      raw: true,
    });
    const user = db.User.findOne({
      where: {
        id: userId,
      },
      raw: true,
    });

    Promise.all([film, user])
      .then(([film, user]) => {
        if (!film) {
          resolve({
            errCode: 1,
            errMessage: "Bộ phim này hiện không tồn tại hay vừa bị xóa!",
          });
        } else if (!user) {
          resolve({
            errCode: 1,
            errMessage: "Người dùng này hiện không tồn tại hay vừa bị xóa!",
          });
        }
      })
      .catch(reject);

    try {
      // Kiểm tra xem trong bản ghi ListUser có đăng ký chưa, nếu có thì thoát luôn
      const exitsRegister = await db.ListUser.findOne({
        where: {
          filmId,
          userId,
        },
      });

      if (exitsRegister) {
        // resolve({
        //   errCode: 3,
        //   errMessage: "Bạn đã đăng ký công việc này rồi!",
        // });
        if (!ticket) {
          resolve({
            errCode: 3,
            errMessage: "Bạn đã đăng ký bộ phim này rồi!",
          });
        } else {
          await exitsRegister.update({ ticket: ticket });
          resolve({
            errCode: 0,
            errMessage: `Bạn đã đăng ký bộ phim này trước đó và cập nhật giá vé thành ${ticket}`,
          });
        }
      } else {
        // Đăng ký bộ phim cho người dùng này
        const addList = await db.ListUser.create({
          filmId: filmId,
          userId: userId,
          ticket: ticket,
        });
        if (addList) {
          resolve({
            errCode: 0,
            errMessage: "Đăng ký thành công.",
          });
        }
        resolve({
          errCode: 2,
          errMessage: "Đăng ký thất bại, lỗi server!.",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUserOfListUser = ({ id, userId, isAdmin }) => {
  if (!id) {
    return {
      errCode: 1,
      errMessage: "Không có id.",
    };
  }

  if ((!userId && isAdmin) || (userId && isAdmin)) {
    return new Promise(async (resolve, reject) => {
      try {
        const listUser = await db.ListUser.findByPk(id);
        if (!listUser) {
          resolve({
            errCode: 2,
            errMessage: "Không tìm thấy kết quả",
          });
        }
        await listUser.destroy();
        resolve({
          errCode: 0,
          errMessage: "Xóa thành công",
        });
      } catch (error) {
        reject(error);
      }
    });
  } else if (userId && !isAdmin) {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(new Date().getDate() + 2);

    return new Promise(async (resolve, reject) => {
      try {
        const list = await db.ListUser.findByPk(id);
        if (!list) {
          resolve({
            errCode: 2,
            errMessage: "Không tìm thấy kết quả",
          });
        }
        const listUser = await db.ListUser.findOne({
          nest: true,
          where: {
            id,
          },
          include: [
            {
              model: db.Film,
              as: "film",
              where: {
                startDate: {
                  [Op.gt]: twoDaysAgo,
                },
              },
            },
          ],
        });

        if (!listUser) {
          resolve({
            errCode: 2,
            errMessage: "Không thể hủy vé trước 2 ngày. Xin cảm ơn!",
          });
        } else {
          const idFilm = listUser.dataValues.filmId;
          const film = await db.Film.findByPk(idFilm);
          const response = await film.decrement("curUser", {
            by: 1,
          });
          if (response) {
            await listUser.destroy();
          }
        }
        resolve({
          errCode: 0,
          errMessage: "Xóa thành cồng!",
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

const getFilmOfUserRegistered = ({ userId }) => {
  if (!userId) {
    return {
      errCode: 1,
      errMessage: "Không có userId",
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      const listFilm = await db.ListUser.findAll({
        where: {
          userId: userId,
        },
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
        data: listFilm.map((film) => film.filmId),
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getDataStatisticalParReq = ({ year = new Date().getFullYear() - 1 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const listFilmPar = await db.ListUser.findAll({
        where: {
          status: 1,
        },
        raw: true,
        nest: true,
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("startDate")), "month"],
          [Sequelize.fn("COUNT", "*"), "count"],
        ],
        include: [
          {
            model: db.Film,
            as: "film",
            where: {
              startDate: Sequelize.literal(`YEAR(startDate) = ${year}`),
            },
          },
        ],
        group: [Sequelize.fn("MONTH", Sequelize.col("startDate"))],
      });
      let dataPar = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      listFilmPar.forEach((month) => {
        dataPar[month - month - 1] = month.count;
      });

      const listFilmReq = await db.ListUser.findAll({
        raw: true,
        nest: true,
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("startDate")), "month"],
          [Sequelize.fn("COUNT", "*"), "count"],
        ],
        where: {
          status: 0,
        },
        include: [
          {
            model: db.Film,
            as: "film",
            where: {
              startDate: Sequelize.literal(`YEAR(startDate) = ${year}`),
            },
          },
        ],
        group: [Sequelize.fn("MONTH", Sequelize.col("startDate"))],
      });
      let dataReq = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      listFilmReq.forEach((month) => {
        dataReq[month.month - 1] = month.count;
      });

      return resolve({
        errCode: 0,
        errMessage: "Success!",
        data: {
          Par: dataPar,
          Req: dataReq,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getFilm,
  getFilmReg,
  getFilmAndCountRequest,
  filmBrowse,
  createFilm,
  registerFilm,
  deleteUserOfListUser,
  getFilmOfUserRegistered,
  getDataStatisticalParReq,
};
