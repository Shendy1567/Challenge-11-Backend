const express = require("express");
const app = express();
const api = require("./api");
const imageRoutes = require("../routes/api/image.routes");

app.use("/api", api);
app.get("/", (req, res) => {
  res.send("test");
});

app.use("/image", imageRoutes);

module.exports = app;
