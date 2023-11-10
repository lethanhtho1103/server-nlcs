const db = require("../app/models");

const authLogin = (id, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Id trống!",
        });
      } else if (!password) {
        resolve({
          errCode: 1,
          errMessage: "Password trống!",
        });
      }

      const userData = await db.User.findOne({
        where: {
          id,
          password,
        },
        raw: true,
      });
      if (!userData) {
        resolve({
          errCode: 2,
          errMessage: "Tên đăng nhập hoặc mật khẩu không đúng!",
        });
      }

      delete userData.password;
      resolve({
        errCode: 0,
        errMessage: "",
        userData: userData,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const authRegister = (name, id, password, confPass) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (name === "") {
        resolve({
          errCode: 1,
          errMessage: "Họ và tên trống!",
        });
      } else if (id === "") {
        resolve({
          errCode: 1,
          errMessage: "Tên đăng nhập rỗng!",
        });
      } else if (id.length <= 6) {
        resolve({
          errCode: 1,
          errMessage: "Tên đăng nhập phải lớn hơn 6 kí tự!",
        });
      } else if (password === "") {
        resolve({
          errCode: 1,
          errMessage: "Mật khẩu trống!",
        });
      } else if (password.length <= 8) {
        resolve({
          errCode: 1,
          errMessage: "Mật khẩu phải lớn hơn 8 kí tự!",
        });
      } else if (confPass === "") {
        resolve({
          errCode: 1,
          errMessage: "Nhập lại mật khẩu trống!",
        });
      } else {
        const alreadyRegister = await db.User.findOne({
          where: {
            id,
          },
        });

        if (alreadyRegister) {
          resolve({
            errCode: 1,
            errMessage: "Tài khoản đã tồn tài trước đó",
          });
        }

        if (password === confPass) {
          const newUser = new db.User({ name, id, password });
          const saveUser = await newUser.save();
          if (saveUser) {
            resolve({
              errCode: 0,
              errMessage: "",
            });
          }
        } else {
          resolve({
            errCode: 1,
            errMessage: "Nhập lại mật khẩu không đúng. Vui lòng nhập lại!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllTicketUserCancel = ({ userId }) => {
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
          status: 0,
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
          {
            model: db.User,
            as: "userFilm",
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

const updateMoneyRefund = async ({ id, moneyRefund }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: {
          id: id,
        },
      });

      if (!user) {
        return resolve({
          errCode: 1,
          errMesagge: `Người dùng ${id} Không tồn tại`,
        });
      }
      await user.update({ moneyRefund });
      resolve({
        errCode: 0,
        errMessage: user,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  authLogin,
  authRegister,
  getAllTicketUserCancel,
  updateMoneyRefund,
};
