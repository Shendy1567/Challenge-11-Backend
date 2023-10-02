require("dotenv").config();
const express = require("express");
const app = express();
const apiRouter = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
	"http://localhost:3000",
	"http://example1.com",
	"http://example2.com",
];

const corsOptions = {
	origin: function (origin, callback) {
		if (allowedOrigins.includes(origin) || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", apiRouter);

const PORT = 8000;
app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server is running on port ${PORT}.`);
});
