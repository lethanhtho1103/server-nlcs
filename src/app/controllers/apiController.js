const apiUserService = require("../../services/apiUserService");
const apiDetailComboService = require("../../services/apiDetailComboService");
const apiFilmService = require("../../services/apiFilmService");
const apiAdminService = require("../../services/apiAdminService");

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

  //[GET] /api/v1/detailCombos
  async handleGetDetailCombos(req, res, next) {
    const listUserId = req.query.listUserId;
    const detailCombos = await apiDetailComboService.getDetailCombo({
      listUserId,
    });
    res.status(200).json(detailCombos);
  }

  //[POST] /api/v1/detail-combo/create
  async handleCreateDetailCombo(req, res, next) {
    const { listUserId, quantity, cornWaterId } = req.body;
    const data = { listUserId, quantity, cornWaterId };
    const response = await apiDetailComboService.createDetailCombo(data);
    return res.status(200).json(response);
  }

  //[DELETE] /api/v1/post/delete
  async handelDeletePost(req, res, next) {
    const response = await apiDetailComboService.deletePostById({
      id: req.query.id,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/post/:id
  async handelGetPostById(req, res, next) {
    const response = await apiDetailComboService.getPostById({
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
    const response = await apiDetailComboService.updatePost({
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
      trailer,
      avgRate,
    } = req.body;

    if (
      !name ||
      !type ||
      // !image ||
      !origin ||
      !startDate ||
      !totalTime ||
      !ageAllowed ||
      !content
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
      trailer,
      avgRate,
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

  //[GET] /api/v1/listuser/get-one-film-user-reg
  async handleGetOneFilmReg(req, res) {
    const filmId = req.query.filmId;
    const userId = req.query.userId;
    const startDate = req.query.startDate;
    const startTime = req.query.startTime;
    if (!userId && !filmId && !startTime && !startDate) {
      return res.status(200).json({
        errCode: 4,
        errMessage: "Thiếu tham số filmId",
      });
    }

    const response = await apiFilmService.getOneFilmReg({
      filmId,
      userId,
      startDate,
      startTime,
    });
    return res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-playing
  async handleGetAllFilmPlaying(req, res) {
    const limit = req.query.limit;
    const offset = req.query.offset;
    if (parseInt(limit) && parseInt(offset)) {
      const response = await apiFilmService.getAllFilmPlaying(
        parseInt(limit),
        parseInt(offset)
      );
      return res.status(200).json(response);
    }
    const response = await apiFilmService.getAllFilmPlaying(parseInt(limit));
    return res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-upcoming
  async handleGetAllFilmUpComing(req, res) {
    const response = await apiFilmService.getAllFilmUpComing();
    return res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all
  async handleGetAllFilm(req, res) {
    const response = await apiFilmService.getAllFilm();
    return res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-showtime
  async handleGetAllShowTime(req, res) {
    const response = await apiAdminService.getAllShowTimes();
    return res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-showtime-cancel
  async handleGetAllShowTimeCancel(req, res) {
    const response = await apiAdminService.getAllShowTimesCancel();
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
    const {
      filmId,
      userId,
      ticket,
      seat,
      startTime,
      startDate,
      priceTicket,
      roomId,
    } = req.body;
    if (!filmId || !userId) {
      return res.status(404).json({
        errCode: 4,
        errMessage: "Thiếu tham số hay truyền chưa đúng!",
      });
    }
    const response = await apiFilmService.registerFilm(
      filmId,
      userId,
      ticket,
      seat,
      startTime,
      startDate,
      priceTicket,
      roomId
    );
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

  //[GET] /api/v1/film-user-register-cancel
  async handleGetFilmUserRegisterCancel(req, res) {
    const response = await apiUserService.getAllTicketUserCancel({
      userId: req.query.userId,
      filmId: req.query.filmId,
      startTime: req.query.startTime,
      startDate: req.query.startDate,
      roomId: req.query.roomId,
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

  //[GET] /api/v1/film/get-all-listuser
  async handleGetAllListUsers(req, res) {
    const data = await apiFilmService.getAllListUsers();
    res.status(200).json(data);
  }

  //[GET] /api/v1/film/total-ticket
  async handleTotalTicket(req, res) {
    const filmId = req.query.filmId;
    const startTime = req.query.startTime;
    const startDate = req.query.startDate;
    const data = await apiFilmService.totalTicket({
      filmId,
      startTime,
      startDate,
    });
    res.status(200).json(data);
  }

  // [GET] /api/v1/statistical/user-par-req
  async handleStatisticalParReq(req, res) {
    const year = req.query.year;
    const response = await apiFilmService.getDataStatisticalParReq({ year });
    res.status(200).json(response);
  }

  // [GET] /api/v1/statistical/film
  async handleStatisticalFilm(req, res) {
    const year = req.query.year;
    const filmId = req.query.filmId;
    const response = await apiAdminService.getDataStatisticalFilm({
      year,
      filmId,
    });
    res.status(200).json(response);
  }

  // [GET] /api/v1/statistical/corn-water
  async handleStatisticalCornWater(req, res) {
    const year = req.query.year;
    const response = await apiAdminService.getDataStatisticalCornWater({
      year,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/film/search-films
  async handleSearchFilms(req, res) {
    const name = req.query.name;
    const response = await apiFilmService.searchFilms({ name });
    return res.status(200).json(response);
  }

  //[PATCH] /api/v1/user-comment
  async handleUserComment(req, res, next) {
    const { comment, rate } = req.body;
    const data = { comment, rate };
    const userId = req.query.userId;
    const filmId = req.query.filmId;

    const response = await apiFilmService.updateComment({
      userId: userId,
      filmId: filmId,
      ...data,
    });
    res.status(200).json(response);
  }

  //[PATCH] /api/v1/user/money-refund
  async handleUserMoneyRefund(req, res, next) {
    const { moneyRefund } = req.body;
    const data = { moneyRefund };
    const id = req.query.id;
    const response = await apiUserService.updateMoneyRefund({
      id: id,
      ...data,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-comments
  async handleGetAllComments(req, res) {
    const response = await apiFilmService.getAllCommentOfFilm({
      filmId: req.query.filmId,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-start-time
  async handleGetAllStartTime(req, res) {
    const response = await apiFilmService.getStartTimeFilm({
      filmId: req.query.filmId,
      startDate: req.query.startDate,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/show-time/get-all-start-time
  async handleGetAllStartTimeFromShowTimes(req, res) {
    const response = await apiFilmService.getAllStartTime({
      roomId: req.query.roomId,
      startDate: req.query.startDate,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/film/get-all-combo
  async handleGetAllCombo(req, res) {
    const response = await apiFilmService.getAllComboCornWater();
    res.status(200).json(response);
  }

  //[PATCH] /api/v1/film/avgRate
  async handleUpdateAvgRateFilm(req, res, next) {
    const { avgRate } = req.body;
    const data = { avgRate };
    const id = req.query.id;

    const response = await apiFilmService.updateAvgRateFilm({
      id: id,
      ...data,
    });
    res.status(200).json(response);
  }

  //[PATCH] /api/v1/film/buy-combo-corn-water
  async handleBuyComboCornWater(req, res, next) {
    const { cornWaterId, quantityCW } = req.body;
    const data = { cornWaterId, quantityCW };
    const userId = req.query.userId;
    const filmId = req.query.filmId;

    const response = await apiFilmService.buyComboCornWater({
      userId: userId,
      filmId: filmId,
      ...data,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/list-user/sum-ticket
  async handleGetListUserAndSumTicket(req, res) {
    const data = await apiAdminService.getListUserAndSumTicket();
    res.status(200).json(data);
  }

  //[GET] /api/v1/list-user/detail-table
  async handleListUserDetailTable(req, res, next) {
    const filmId = req.query.filmId;
    const startDate = req.query.startDate;
    const startTime = req.query.startTime;
    const response = await apiAdminService.getListUserDetailTable({
      filmId: filmId,
      startTime: startTime,
      startDate: startDate,
    });
    res.status(200).json(response);
  }

  //[PATCH] /api/v1/show-time/cancel-one
  async handleCancelOneShowTime(req, res, next) {
    const filmId = req.query.filmId;
    const roomId = req.query.roomId;
    const startDate = req.query.startDate;
    const startTime = req.query.startTime;
    const response = await apiAdminService.cancelOneShowTime({
      filmId: filmId,
      roomId: roomId,
      startDate: startDate,
      startTime: startTime,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/show-times/get-one
  async handleGetOneShowTime(req, res, next) {
    const filmId = req.query.filmId;
    const roomId = req.query.roomId;
    const startDate = req.query.startDate;
    const startTime = req.query.startTime;
    const response = await apiAdminService.getOneShowTime({
      filmId: filmId,
      roomId: roomId,
      startDate: startDate,
      startTime: startTime,
    });
    res.status(200).json(response);
  }

  //[GET] /api/v1/show-time/get-roomId
  async handleGetRoomId(req, res, next) {
    const filmId = req.query.filmId;
    const startDate = req.query.startDate;
    const startTime = req.query.startTime;
    const response = await apiAdminService.getRoomId({
      filmId: filmId,
      startDate: startDate,
      startTime: startTime,
    });
    res.status(200).json(response);
  }
  //[GET] /api/v1/room/get-all-room
  async handleGetAllRoom(req, res) {
    const data = await apiAdminService.getAllRoom();
    res.status(200).json(data);
  }

  //[GET] /api/v1/room/get-one
  async handelGetRoomById(req, res, next) {
    const response = await apiAdminService.getRoomById({
      id: req.query.id,
    });
    res.status(200).json(response);
  }

  //[POST] /api/v1/show-time/create
  async handleCreateShowTime(req, res, next) {
    const { filmId, startDate, startTime, roomId } = req.body;
    if (!filmId || !startDate || !startTime || !roomId) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "Missing input",
      });
    }

    const response = await apiAdminService.createShowTime({
      filmId,
      startDate,
      startTime,
      roomId,
    });
    return res.status(200).json(response);
  }

  //[PATCH] /api/v1/show-time/currUser
  async handleUpdateCurrUser(req, res, next) {
    const { currUser } = req.body;
    const data = { currUser };
    const filmId = req.query.filmId;
    const roomId = req.query.roomId;
    const startDate = req.query.startDate;
    const startTime = req.query.startTime;
    const response = await apiAdminService.updateCurrUser({
      filmId: filmId,
      roomId: roomId,
      startDate: startDate,
      startTime: startTime,
      ...data,
    });
    res.status(200).json(response);
  }

  //[PATCH] /api/v1/list-user/status
  async handleUpdateStatus(req, res, next) {
    const filmId = req.query.filmId;
    const roomId = req.query.roomId;
    const startDate = req.query.startDate;
    const startTime = req.query.startTime;
    const response = await apiAdminService.updateStatusListUsers({
      filmId: filmId,
      roomId: roomId,
      startDate: startDate,
      startTime: startTime,
    });
    res.status(200).json(response);
  }
}

module.exports = new apiController();
