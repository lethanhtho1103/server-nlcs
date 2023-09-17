const apiUserService = require("../../services/apiUserService");
const apiPostService = require("../../services/apiPostService");
const apiFilmService = require("../../services/apiFilmService");
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
    const { name, id, password, confPass } = req.body;
    const data = await apiUserService.authRegister(
      name,
      id,
      password,
      confPass
    );
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
    const { userId, name, description } = req.body;
    const file = req.file ? req.file : req.body.image;
    if (!userId || !name || !description) {
      if (file) {
        cloudinary.uploader.destroy(file.filename);
      }
      return res.status(200).json({
        errCode: 3,
        errMessage: "Missing parameters!!",
      });
    }
    const data = { userId, name, description, file };
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
    const { userId, name, description } = req.body;
    const file = req.file ? req.file : req.body.image;

    if (!userId || !name || !description) {
      if (file) {
        cloudinary.uploader.destroy(file.filename);
      }
      return res.status(200).json({
        errCode: 3,
        errMessage: "Missing parameters!!",
      });
    }
    const data = { userId, name, description, file };
    const id = req.params.id;
    const response = await apiPostService.updatePost({
      id: id,
      ...data,
    });
    res.status(200).json(response);
  }

  // ***************************************

  //[POST] /api/v1/film/create
  async handleCreateFilm(req, res, next) {
    const {
      name,
      type,
      image,
      backgroundImage,
      origin,
      startDate,
      totalTime,
      ageAllowed,
      content,
      title,
      evaluate,
    } = req.body;

    if (
      !name ||
      !type ||
      !image ||
      !backgroundImage ||
      !origin ||
      !startDate ||
      !totalTime ||
      !ageAllowed ||
      !content ||
      !title ||
      !evaluate
    ) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing input",
      });
    }

    const response = await apiFilmService.createFilm({
      name,
      type,
      image,
      backgroundImage,
      origin,
      startDate,
      totalTime,
      ageAllowed,
      content,
      title,
      evaluate,
    });
    return res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-one
  async handleGetOneFilm(req, res) {
    if (!req.query.filmId) {
      return res.status(200).json({
        errCode: 4,
        errMessage: "Thiếu tham số filmId",
      });
    }

    const response = await apiFilmService.getFilm({ filmId: req.query.filmId });
    return res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-playing
  async handleGetAllFilmPlaying(req, res) {
    const response = await apiFilmService.getAllFilmPlaying();
    return res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-upcoming
  async handleGetAllFilmUpComing(req, res) {
    const response = await apiFilmService.getAllFilmUpComing();
    return res.status(200).json(response);
  }

  // [PATCH] /api/v1/film-browse
  async handleBrower(req, res) {
    const idFilm = req.body.id;
    if (!idFilm) {
      res.status(200).json({
        errCode: 1,
        errMessage: "Không có id!",
      });
    }
    const response = await apiFilmService.filmBrowse(idFilm, 1);
    res.status(200).json(response);
  }

  //[POST] /api/v1/film/register
  async handleRegisterFilm(req, res) {
    const { filmId, userId, ticket } = req.body;
    if (!filmId || !userId) {
      return res.status(404).json({
        errCode: 4,
        errMessage: "Thiếu tham số hay truyền chưa đúng!",
      });
    }
    const response = await apiFilmService.registerFilm(filmId, userId, ticket);
    res.status(200).json(response);
  }

  //[DELETE] /api/v1/listuser/delete
  async handleDeleteListUser(req, res) {
    const id = req.body.id;
    const isAdmin = req.body.isAdmin;
    const userId = req.body.userId;
    if (!userId && !isAdmin) {
      res.status(404).json({
        errCode: 4,
        errMessage: "Thiếu tham số",
      });
    }
    const response = await apiFilmService.deleteUserOfListUser({
      id,
      userId,
      isAdmin,
    });
    res.status(200).send(response);
  }

  //[GET] /api/v1/film-user-register
  async handleGetFilmUserRegister(req, res) {
    const response = await apiFilmService.getFilmOfUserRegistered({
      userId: req.query.userId,
    });
    res.status(200).send(response);
  }

  // [GET] /api/v1/film-user
  // Có vấn đề chưa fix xong
  async handleGetFilmUser(req, res) {
    const userId = req.query.userId;
    const isChecked = req.query.isChecked;
    if (!userId) {
      res.status(200).json({
        errCode: 3,
        errMessage: "User trống!",
      });
    }
    const data = await apiFilmService.getFilmReg({
      isChecked: 1,
      userId,
      isChecked,
    });
    res.status(200).json(data);
  }

  //[GET] /api/v1/film/get-and-count-resquest
  async handleGetFilmAndCountRequest(req, res) {
    const data = await apiFilmService.getFilmAndCountRequest({});
    res.status(200).json(data);
  }

  //[GET] /api/v1/film/total-ticket
  async handleTotalTicket(req, res) {
    const filmId = req.query.filmId;
    const data = await apiFilmService.totalTicket({ filmId });
    res.status(200).json(data);
  }

  // [GET] /api/v1/statistical/user-par-req
  async handleStatisticalParReq(req, res) {
    const year = req.query.year;
    const response = await apiFilmService.getDataStatisticalParReq({ year });
    res.status(200).json(response);
  }
}

module.exports = new apiController();
