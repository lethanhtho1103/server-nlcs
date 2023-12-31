const express = require("express");
const apiController = require("../app/controllers/apiController");
const router = express.Router();

router.post("/v1/login", apiController.handleLogin);
router.post("/v1/register", apiController.handleRegister);
router.get("/v1/detailCombos", apiController.handleGetDetailCombos);
router.post("/v1/detail-combo/create", apiController.handleCreateDetailCombo);
router.delete("/v1/post/delete", apiController.handelDeletePost);
router.get("/v1/post/:id", apiController.handelGetPostById);
router.patch("/v1/post/:id", apiController.handleUpdatePost);
router.get("/v1/film/get-one", apiController.handleGetOneFilm);
router.get("/v1/film/get-all-playing", apiController.handleGetAllFilmPlaying);
router.get("/v1/film/get-all", apiController.handleGetAllFilm);
router.get("/v1/film/get-all-upcoming", apiController.handleGetAllFilmUpComing);
router.get("/v1/film/get-all-showtime", apiController.handleGetAllShowTime);
router.get(
  "/v1/film/get-all-showtime-cancel",
  apiController.handleGetAllShowTimeCancel
);

router.post("/v1/film/create", apiController.handleCreateFilm);
router.post("/v1/film/register", apiController.handleRegisterFilm);
router.delete("/v1/listuser/delete", apiController.handleDeleteListUser);
router.get(
  "/v1/listuser/film-user-register",
  apiController.handleGetFilmUserRegister
);
router.get(
  "/v1/listuser/film-user-register-cancel",
  apiController.handleGetFilmUserRegisterCancel
);
router.get(
  "/v1/listuser/get-one-film-user-reg",
  apiController.handleGetOneFilmReg
);
router.get("/v1/film/get-all-listuser", apiController.handleGetAllListUsers);
router.get("/v1/film-user", apiController.handleGetFilmUser);
router.patch("/v1/film-browse", apiController.handleBrower);
router.get(
  "/v1/statistical/user-par-req",
  apiController.handleStatisticalParReq
);
router.get("/v1/film/total-ticket", apiController.handleTotalTicket);
router.get("/v1/film/search-films", apiController.handleSearchFilms);
router.patch("/v1/user-comment", apiController.handleUserComment);
router.patch("/v1/user/money-refund", apiController.handleUserMoneyRefund);
router.get("/v1/film/get-all-comments", apiController.handleGetAllComments);
router.get("/v1/film/get-all-start-time", apiController.handleGetAllStartTime);
router.get(
  "/v1/show-time/get-all-start-time",
  apiController.handleGetAllStartTimeFromShowTimes
);

router.get(
  "/v1/film/get-all-combo-corn-water",
  apiController.handleGetAllCombo
);
router.patch("/v1/film/avgRate", apiController.handleUpdateAvgRateFilm);
router.patch(
  "/v1/film/buy-combo-corn-water",
  apiController.handleBuyComboCornWater
);

// admin
router.get(
  "/v1/list-user/sum-ticket",
  apiController.handleGetListUserAndSumTicket
);
router.get(
  "/v1/list-user/detail-table",
  apiController.handleListUserDetailTable
);

router.patch("/v1/show-time/cancel-one", apiController.handleCancelOneShowTime);

router.get("/v1/show-time/get-one", apiController.handleGetOneShowTime);
router.get("/v1/show-time/get-roomId", apiController.handleGetRoomId);
router.patch("/v1/show-time/currUser", apiController.handleUpdateCurrUser);
router.patch("/v1/list-user/status", apiController.handleUpdateStatus);
router.get("/v1/room/get-all-room", apiController.handleGetAllRoom);
router.get("/v1/room/get-one", apiController.handelGetRoomById);
router.post("/v1/show-time/create", apiController.handleCreateShowTime);

router.get(
  "/v1/statistical/user-par-req",
  apiController.handleStatisticalParReq
);
router.get("/v1/statistical/film", apiController.handleStatisticalFilm);
router.get(
  "/v1/statistical/corn-water",
  apiController.handleStatisticalCornWater
);
module.exports = router;
