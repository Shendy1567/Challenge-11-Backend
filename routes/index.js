const express = require("express");
const app = express();
const api = require("./api");
const imageRoutes = require("../routes/api/image.routes");

app.use("/api", api);

app.use("/image", imageRoutes);

module.exports = app;
