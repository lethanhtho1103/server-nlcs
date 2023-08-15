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

const authRegister = (id, password) => {
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

      const newUser = new db.User({ id, password });
      const saveUser = await newUser.save();
      if (saveUser) {
        resolve({
          Message: "Đăng ký tài khoản thành công",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { authLogin, authRegister };
