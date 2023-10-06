const playerRepository = require("../repository/player.repository");
const { hashPassword, verifyPassword } = require("../utils/passwordHandler");
const jwt = require("jsonwebtoken");

class AuthServices {
  async registerPlayer(username, email, password) {
    try {
      const newPassword = await hashPassword(password);

      await playerRepository.createUser(
        username,
        email,
        newPassword,
        "user",
        "https://res.cloudinary.com/dz0cuhiny/image/upload/v1695553065/ldktrzeo1oud4iidzx9f.jpg"
      );

      return { success: true, message: "player register is succeed" };
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async checkByEmail(email) {
    try {
      return await playerRepository.findByEmail(email);
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async checkByToken(refreshToken) {
    try {
      return await playerRepository.findByToken(refreshToken);
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async loginPlayer(password, user) {
    try {
      const matchPassword = await verifyPassword(password, user.password);
      if (!matchPassword) {
        return { success: false, message: "wrong password" };
      }
      const userId = user.id;
      const userUsername = user.username;
      const userEmail = user.email;

      const accessToken = jwt.sign(
        { userId, userUsername, userEmail },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "20s",
        }
      );

      const refreshToken = jwt.sign(
        { userId, userUsername, userEmail },
        process.env.REFRESH_TOKEN,
        {
          expiresIn: "1d",
        }
      );

      await playerRepository.updateToken(refreshToken, userId);
      return { success: true, refreshToken, accessToken };
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async logoutPlayer(user) {
    const userId = user.id;
    await playerRepository.updateToken(null, userId);
  }

  async refreshToken(refreshToken, user) {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return { success: false, message: "token error" };
      }
    });
    const userId = user.id;
    const username = user.username;
    const email = user.email;
    const picture = user.profile_image_url;

    const accessToken = jwt.sign(
      { userId, username, email, picture },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "15s",
      }
    );
    return { success: true, accessToken };
  }
}

module.exports = new AuthServices();
