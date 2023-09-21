require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/", apiRouter);

const PORT = 8000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}.`);
});
