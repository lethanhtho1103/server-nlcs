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

module.exports = { authLogin, authRegister };
