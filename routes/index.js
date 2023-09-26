const apiRouter = require("express").Router();
const api = require("../routes/api");
const imageRoutes = require('../routes/api/image.routes');
const videoRoutes = require('../routes/api/video.routes')

apiRouter.get("/", (req, res) => {
    res.send("test");
});

apiRouter.use("/api", api);
apiRouter.use("/image", imageRoutes);
apiRouter.use("/video", videoRoutes);

module.exports = apiRouter;