const siteRouter = require("./siteRouter");

const route = (app) => {
  app.use("/", siteRouter);
};

module.exports = route;
