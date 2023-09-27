const { User } = require("../database/models");
const { hashPassword, verifyPassword } = require("../utils/passwordHandler");
const jwt = require("jsonwebtoken");

module.exports = class AuthContollers {
  async registerPlayer(req, res, next) {
    const { username, email, password, confPassword } = req.body;

    if (await User.findOne({ where: { email } }))
      return res.status(400).json({ msg: "Email sudah di gunakan" });

    if (password !== confPassword)
      return res.status(400).json({ msg: "Password tidak sama" });
    const newPassword = await hashPassword(password);

    try {
      await User.create({
        username: username,
        email: email,
        password: newPassword,
        role: "user",
        profile_image_url:
          "https://res.cloudinary.com/dz0cuhiny/image/upload/v1695553065/ldktrzeo1oud4iidzx9f.jpg",
      });
      res.status(200);
      res.json({ msg: "Register player berhasil" });
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }

  async loginPlayer(req, res) {
    try {
      const user = await User.findOne({
        where: {
          email: req.body.email,
        },
      });

      const matchPassword = await verifyPassword(
        req.body.password,
        user.password
      );
      if (!matchPassword)
        return res.status(400).json({ msg: "Password Salah" });

      const userId = user.id;
      const username = user.username;
      const email = user.email;

      const accessToken = jwt.sign(
        { userId, username, email },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "20s",
        }
      );

      const refreshToken = jwt.sign(
        { userId, username, email },
        process.env.REFRESH_TOKEN,
        {
          expiresIn: "1d",
        }
      );

      await User.update(
        { refresh_token: refreshToken },
        {
          where: {
            id: userId,
          },
        }
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200);
      res.json({ accessToken });
    } catch (error) {
      res.status(404).json({ msg: "Email tidak ditemukan" });
    }
  }

  async logoutPlayer(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) return res.sendStatus(204);
    const userId = user.id;
    await User.update(
      { refresh_token: null },
      {
        where: {
          id: userId,
        },
      }
    );
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  }

  async refreshToken(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.sendStatus(204);
      const user = await User.findOne({
        where: {
          refresh_token: refreshToken,
        },
      });
      if (!user) {
        res.sendStatus(404);
        res.clearCookie("refreshToken");
      }
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
        if (err) {
          res.clearCookie("refreshToken");
          res.sendStatus(403);
        }
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
        res.sendStatus(200);
        res.json({ accessToken });
      });
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }
};
