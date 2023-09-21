const apiRouter = require("express").Router();
const api = require("./api");

apiRouter.get("/", (req, res) => {
  res.send("test");
});

apiRouter.use("/api", api);

module.exports = apiRouter;
