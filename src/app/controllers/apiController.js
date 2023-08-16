const apiUserService = require("../../services/apiUserService");
const apiPostService = require("../../services/apiPostService");
const cloudinary = require("cloudinary").v2;

class apiController {
  // [POST] /api/v1/login
  async handleLogin(req, res, next) {
    const { id, password } = req.body;
    const data = await apiUserService.authLogin(id, password);
    res.status(200).json(data);
  }

  // [POST] /api/v1/register
  async handleRegister(req, res, next) {
    const { id, password } = req.body;
    const data = await apiUserService.authRegister(id, password);
    res.status(200).json(data);
  }

  //[GET] /api/v1/post
  async handleGetPost(req, res, next) {
    const userId = req.query.id;
    const posts = await apiPostService.getPost({ userId });
    res.status(200).json(posts);
  }

  //[POST] /api/v1/post
  async handleUpPost(req, res, next) {
    const { userId, name, description, price } = req.body;
    const file = req.file ? req.file : req.body.image;
    if (!userId || !name || !description || !price) {
      if (file) {
        cloudinary.uploader.destroy(file.filename);
      }
      return res.status(200).json({
        errCode: 3,
        errMessage: "Missing parameters!!",
      });
    }
    const data = { userId, name, description, price, file };
    const response = await apiPostService.upPost(data);
    return res.status(200).json(response);
  }

  //[DELETE] /api/v1/post/delete
  async handelDeletePost(req, res, next) {
    const response = await apiPostService.deletePostById({
      id: req.query.id,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/post/:id
  async handelGetPostById(req, res, next) {
    const response = await apiPostService.getPostById({
      id: req.params.id,
    });
    res.status(200).json(response);
  }

  //[PATCH] /api/v1/post/:id
  async handleUpdatePost(req, res, next) {
    const { userId, name, description, price } = req.body;
    const file = req.file ? req.file : req.body.image;

    if (!userId || !name || !description || !price) {
      if (file) {
        cloudinary.uploader.destroy(file.filename);
      }
      return res.status(200).json({
        errCode: 3,
        errMessage: "Missing parameters!!",
      });
    }
    const data = { userId, name, description, price, file };
    const id = req.params.id;
    const response = await apiPostService.updatePost({
      id: id,
      ...data,
    });
    res.status(200).json(response);
  }
}

module.exports = new apiController();
