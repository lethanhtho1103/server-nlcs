const express = require("express");
const apiController = require("../app/controllers/apiController");
const router = express.Router();

router.post("/v1/login", apiController.handleLogin);
router.post("/v1/register", apiController.handleRegister);
router.get("/v1/post", apiController.handleGetPost);
router.post("/v1/post", apiController.handleUpPost);
router.delete("/v1/post/delete", apiController.handelDeletePost);
router.get("/v1/post/:id", apiController.handelGetPostById);
router.patch("/v1/post/:id", apiController.handleUpdatePost);

router.get("/v1/film/get-one", apiController.handleGetOneFilm);
router.post("/v1/film/create", apiController.handleCreateFilm);
router.post("/v1/film/register", apiController.handleRegisterFilm);
router.delete("/v1/listuser/delete", apiController.handleDeleteListUser);
router.get(
  "/v1/listuser/film-user-register",
  apiController.handleGetFilmUserRegister
);

module.exports = router;
