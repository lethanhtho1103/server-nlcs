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

module.exports = router;
