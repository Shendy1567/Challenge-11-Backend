const fs = require("fs");
const crypto = require("crypto");
const dotenv = require("dotenv");

// Generate new values for ACCESS_TOKEN and REFRESH_TOKEN
const newAccessToken = crypto.randomBytes(32).toString("hex");
const newRefreshToken = crypto.randomBytes(64).toString("hex");

// Load the existing .env file
dotenv.config();

// Update the environment variables with the new values
process.env.ACCESS_TOKEN = newAccessToken;
process.env.REFRESH_TOKEN = newRefreshToken;

// Create a new object with the updated values
const updatedEnv = {
  ...dotenv.parse(fs.readFileSync(".env")),
  ACCESS_TOKEN: newAccessToken,
  REFRESH_TOKEN: newRefreshToken,
};

// Write the updated environment variables back to the .env file
fs.writeFileSync(
  ".env",
  Object.entries(updatedEnv)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")
);

console.log(".env file updated with new ACCESS_TOKEN and REFRESH_TOKEN.");
