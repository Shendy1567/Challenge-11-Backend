const express = require("express");
const app = express();
const api = require("./api");
const imageRoutes = require("../routes/api/image.routes");
const videoRoutes = require("../routes/api/video.routes");

app.use("/api", api);

app.use("/image", imageRoutes);
app.use("/video", videoRoutes);

module.exports = app;
