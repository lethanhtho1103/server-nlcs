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
        nest: true,
        include: [
          {
            model: db.ShowTime,
            as: "filmShowTime",
            attributes: {
              exclude: ["id", "filmId", "createdAt", "updatedAt"],
            },
            include: [
              {
                model: db.Room,
                as: "roomShowTime",
                attributes: {
                  exclude: ["id", "createdAt", "updatedAt"],
                },
              },
            ],
          },
        ],
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

const getOneFilmReg = ({ userId, filmId, startDate, startTime }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!filmId) {
        resolve({
          errCode: 1,
          errMessage: `film trống!`,
        });
      }

      const data = await db.ListUser.findOne({
        where: {
          userId: userId,
          filmId: filmId,
          startDate: startDate,
          startTime: startTime,
        },
        raw: true,
        nest: true,
      });

      if (!data) {
        resolve({
          errCode: 2,
          errMessage: `Không tìm thấy! ${filmId}, ${userId},${startDate}, ${startTime} `,
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

const getAllFilmPlaying = (limit, offset) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Film.findAll({
        where: {
          startDate: {
            [Op.lte]: new Date(),
          },
        },
        limit: limit,
        raw: true,
        order: [["startDate", "ASC"]],
        offset: offset,
      });

      if (!data) {
        resolve({
          errCode: 2,
          errMessage: `Không tìm thấy kết quả `,
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

const getAllFilmUpComing = (limit = 5) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Film.findAll({
        where: {
          startDate: {
            [Op.gt]: new Date(),
          },
        },
        raw: true,
        limit: limit,
      });

      if (!data) {
        resolve({
          errCode: 2,
          errMessage: `Không tìm thấy kết quả `,
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

const getAllListUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const listFilm = await db.ListUser.findAll({
        nest: true,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
              ],
            },

            include: [
              {
                model: db.ShowTime,
                as: "filmShowTime",
                attributes: {
                  exclude: ["id", "filmId", "createdAt", "updatedAt"],
                },

                include: [
                  {
                    model: db.Room,
                    as: "roomShowTime",
                  },
                ],
              },
            ],
          },
          {
            model: db.User,
            as: "userFilm",
            attributes: {
              exclude: ["type", "createdAt", "updatedAt"],
            },
          },
        ],
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

const totalTicket = ({ filmId, startTime, startDate }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.ListUser.findAll({
        where: {
          filmId,
          startTime,
          startDate,
        },
        attributes: {
          include: [
            [Sequelize.fn("SUM", Sequelize.col("ticket")), "totalTicket"],
          ],
        },
        raw: true,
        nest: true,
        // separate: true,
      });

      if (data) {
        resolve({
          errCode: 0,
          errMessage: "",
          data: data[0],
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
      // if (new Date(data.startDate) <= new Date()) {
      //   return resolve({
      //     errCode: 2,
      //     errMessage: "Ngày bắt đầu bộ phim phải là ngày trong tương lai",
      //   });
      // }

      const film = await db.Film.create({
        id: uuidv4(),
        name: data.name,
        image: data.image ? data.image : null,
        backgroundImage: data.backgroundImage ? data.backgroundImage : null,
        type: data.type,
        origin: data.origin,
        startDate: data.startDate,
        totalTime: data.totalTime,
        ageAllowed: data.ageAllowed,
        content: data.content ? data.content : null,
        title: data.title,
        trailer: data.trailer,
        avgRate: data.avgRate,
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

const registerFilm = (
  filmId,
  userId,
  ticket,
  seat,
  startTime,
  startDate,
  priceTicket,
  roomId
) => {
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
          startTime,
          startDate,
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
            errMessage: "Bạn đã đặt vé cho bộ phim này rồi!",
          });
        } else {
          data = await exitsRegister.update({ ticket: ticket });
          resolve({
            errCode: 0,
            errMessage: `Bạn đã đặt vé cho bộ phim này trước đó và cập nhật số vé thành ${ticket}`,
            data: data,
          });
        }
      } else {
        // Đăng ký bộ phim cho người dùng này
        const addList = await db.ListUser.create({
          filmId: filmId,
          userId: userId,
          ticket: ticket,
          seat: seat,
          startTime: startTime,
          startDate: startDate,
          priceTicket: priceTicket,
          roomId: roomId,
        });
        if (addList) {
          resolve({
            errCode: 0,
            errMessage:
              "Thanh toán thành công! Vào vé của tôi để xem vé đã đặt.",
            data: addList,
          });
        }
        resolve({
          errCode: 2,
          errMessage: "Đặt vé thất bại, lỗi server!.",
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
        nest: true,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
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
              ],
            },

            include: [
              {
                model: db.ShowTime,
                as: "filmShowTime",
                attributes: {
                  exclude: ["id", "filmId", "createdAt", "updatedAt"],
                },

                include: [
                  {
                    model: db.Room,
                    as: "roomShowTime",
                  },
                ],
              },
            ],
          },
        ],
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

const searchFilms = ({ name }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Film.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        raw: true,
        nest: true,
      });

      if (!data) {
        resolve({
          errCode: 2,
          errMessage: `Không tìm thấy bộ phim có tên= ${name} `,
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

const updateComment = async ({ userId, filmId, comment, rate }) => {
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

const getAllCommentOfFilm = ({ filmId }) => {
  if (!filmId) {
    return {
      errCode: 1,
      errMessage: "Không có filmId",
    };
  }
  return new Promise(async (resolve, reject) => {
    try {
      const listFilm = await db.ListUser.findAll({
        where: {
          filmId: filmId,
        },
        raw: true,
        nest: true,
        // attributes: [Sequelize.fn("AVG", Sequelize.col("rate")), "rate"],
        separate: true,
        include: [
          {
            model: db.User,
            as: "userFilm",
            attributes: {
              exclude: ["password", "type", "createdAt", "updatedAt"],
            },
          },
        ],
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
        // data: listFilm.map((film) => film.filmId),
        data: listFilm,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getStartTimeFilm = ({ filmId, startDate }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const listTime = await db.ShowTime.findAll({
        where: {
          filmId: filmId,
          startDate: startDate,
        },
        raw: true,
        nest: true,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        order: [["startTime", "ASC"]],
      });
      if (!listTime) {
        resolve({
          errCode: 2,
          errMessage: "Không tìm thấy kết quả",
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Thành công!",
        data: listTime,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllComboCornWater = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const listCombo = await db.CornWater.findAll({
        raw: true,
        nest: true,
      });
      if (!listCombo) {
        resolve({
          errCode: 2,
          errMessage: "Không tìm thấy kết quả",
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Thành công!",
        data: listCombo,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateAvgRateFilm = async ({ id, avgRate }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const film = await db.Film.findByPk(id);
      if (!film) {
        return resolve({
          errCode: 1,
          errMesagge: `Bộ phim này không tồn tại`,
        });
      }
      await film.update({ avgRate });
      resolve({
        errCode: 0,
        errMessage: "Thành công",
        data: film,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const buyComboCornWater = async ({
  userId,
  filmId,
  cornWaterId,
  quantityCW,
}) => {
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
          errMessage: `Bạn chưa đăng ký bộ phim này = ${id}`,
        });
      }
      await userFilm.update({ cornWaterId, quantityCW });
      resolve({
        errCode: 0,
        errMessage: "Oke",
        data: userFilm,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getFilm,
  getAllFilmPlaying,
  getAllFilmUpComing,
  getOneFilmReg,
  getFilmReg,
  getAllListUsers,
  filmBrowse,
  createFilm,
  registerFilm,
  deleteUserOfListUser,
  getFilmOfUserRegistered,
  getDataStatisticalParReq,
  totalTicket,
  searchFilms,
  updateComment,
  getAllCommentOfFilm,
  getStartTimeFilm,
  getAllComboCornWater,
  updateAvgRateFilm,
  buyComboCornWater,
};
