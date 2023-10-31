const db = require("../app/models");
// const { Sequelize } = require("../app/models");

const getPost = ({ userId, limit = 8 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: 1,
          errMessage: "id trống!",
        });
      }
      const posts = await db.Post.findAll({
        where: {
          userId,
        },
        raw: true,
        nest: true,
        limit: limit,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["userId"],
        },
        include: [
          {
            model: db.User,
            as: "user",
            attributes: {
              exclude: ["password", "createdAt", "updatedAt"],
            },
          },
        ],
      });
      if (posts) {
        resolve({
          errCode: 0,
          errMesagge: "",
          posts: posts,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const createDetailCombo = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newDetailCombo = await db.DetailCombo.create({
        userId: data.userId,
        quantity: data.quantity,
        cornWaterId: data.cornWaterId,
      });

      if (newDetailCombo) {
        resolve({
          errCode: 0,
          errMessage: "Mua bắp nước thành công",
          data: newDetailCombo,
        });
      }

      resolve({
        errCode: 2,
        errMessage: "Thất bại",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const checkUserData = (userId) => {
  let isHaveUser = false;

  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });
      if (user) {
        isHaveUser = true;
      }
      resolve(isHaveUser);
    } catch (err) {
      reject(err);
    }
  });
};

const deletePostById = ({ id }) => {
  if (!id) {
    return {
      errCode: 2,
      errMessage: "Error! Không có id truyền vào",
    };
  }

  return new Promise(async (resolve, reject) => {
    try {
      const post = await db.Post.findOne({ where: { id: id } });

      if (post) {
        post.destroy();
        resolve({
          errCode: 0,
          errMessage: "Xóa thành công!",
          data: post,
        });
      }
      resolve({
        errCode: 1,
        errMessage: "Không tìm thấy bài post!",
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getPostById = ({ id }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await db.Post.findByPk(id);

      if (post) {
        resolve({
          errCode: 0,
          errMessage: "Success",
          data: post,
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

const updatePost = async ({ id, userId, name, description, file }) => {
  return new Promise(async (resolve, reject) => {
    const isHaveUser = await checkUserData(userId);
    let image;
    if (!isHaveUser) {
      return resolve({
        errCode: 1,
        errMesagge: "Không có User!",
      });
    }
    if (file && file?.path) {
      image = file.path;
    } else {
      image = file;
    }
    try {
      const post = await db.Post.findByPk(id);

      if (!post) {
        // uploadClound.storage.cloudinary.uploader.destroy(file.filename);
        return resolve({
          errCode: 1,
          errMesagge: `Không tìm thấy bài đăng có id = ${id}`,
        });
      }

      // let imgLink = post.dataValues.image;
      await post.update({ name, description, image: image });
      resolve({
        errCode: 0,
        errMesagge: "Ok!",
      });
      // const strArr = imgLink.split("/");
      // const strSplipDot = strArr[strArr.length - 1].split(".");
      // const nameImg = "nienluan_image-post/" + strSplipDot[0];

      // return uploadClound.storage.cloudinary.uploader.destroy(
      //   nameImg,
      //   (err, result) => {
      //     console.log(result);
      //     console.log(err);
      //   }
      // );
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getPost,
  createDetailCombo,
  deletePostById,
  getPostById,
  updatePost,
};
