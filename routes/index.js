const apiRouter = require("express").Router();
const api = require("../routes/api");
const imageRoutes = require('../routes/api/image.routes');

apiRouter.get("/", (req, res) => {
    res.send("test");
});

apiRouter.use("/api", api);
apiRouter.use("/image", imageRoutes);

module.exports = apiRouter;