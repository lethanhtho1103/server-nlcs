const siteRouter = require("./siteRouter");
const apiRouter = require("./apiRouter");
const route = (app) => {
  app.use("/", siteRouter);
  app.use("/api", apiRouter);
};

module.exports = route;
