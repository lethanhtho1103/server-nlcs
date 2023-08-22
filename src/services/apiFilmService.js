const { v4: uuidv4 } = require("uuid");
const db = require("../app/models/");
const { Op } = require("sequelize");

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

module.exports = {
  getFilm,
  createFilm,
  registerFilm,
  deleteUserOfListUser,
  getFilmOfUserRegistered,
};
