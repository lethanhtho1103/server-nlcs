class siteController {
  // [GET] /
  index(req, res, next) {
    res.send("home");
  }

  // [GET] /about
  about(req, res, next) {
    res.render("about");
  }
}

module.exports = new siteController();
