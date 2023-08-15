const express = require("express");
const apiController = require("../app/controllers/apiController");
const router = express.Router();

router.post("/v1/login", apiController.handleLogin);
router.post("/v1/register", apiController.handleRegister);

module.exports = router;
