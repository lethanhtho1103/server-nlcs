const apiUserService = require("../../services/apiUserService");

class apiController {
  // [POST] /api/v1/login
  async handleLogin(req, res, next) {
    const { id, password } = req.body;
    const data = await apiUserService.authLogin(id, password);
    res.status(200).json(data);
  }

  async handleRegister(req, res, next) {
    const { id, password } = req.body;
    const data = await apiUserService.authRegister(id, password);
    res.status(200).json(data);
  }
}

module.exports = new apiController();
