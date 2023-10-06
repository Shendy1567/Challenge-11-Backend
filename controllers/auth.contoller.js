const authServices = require("../services/auth.services");

module.exports = class AuthContollers {
  async registerPlayer(req, res, next) {
    try {
      const { username, email, password, confPassword } = req.body;

      const existingUser = await authServices.checkByEmail(email);

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email sudah digunakan" });
      }

      if (password !== confPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Password tidak sama" });
      }

      const registrationResult = await authServices.registerPlayer(
        username,
        email,
        password,
        confPassword
      );

      if (registrationResult.success) {
        res
          .status(200)
          .json({ success: true, message: registrationResult.message });
      } else {
        res
          .status(400)
          .json({ success: false, message: registrationResult.message });
      }
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }

  async loginPlayer(req, res) {
    try {
      const { email, password } = req.body;
      const user = await authServices.checkByEmail(email);
      const login = await authServices.loginPlayer(password, user);

      if (login.success) {
        res.cookie("refreshToken", login.refreshToken, {
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
        });

        res.status(200);
        res.json({ accessToken: login.accessToken });
      } else {
        res.status(400).json({ msg: login.message });
      }
    } catch (error) {
      res.status(404).json({ msg: "Email tidak ditemukan" });
    }
  }

  async logoutPlayer(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await authServices.checkByToken(refreshToken);
    if (!user) return res.sendStatus(204);
    await authServices.logoutPlayer(user);
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  }

  async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.sendStatus(204);
      const user = await authServices.checkByToken(refreshToken);
      if (!user) return res.clearCookie("refreshToken").sendStatus(403);
      const token = await authServices.refreshToken(refreshToken, user);
      if (token.success) {
        return res.status(200).json({ accessToken: token.accessToken });
      } else {
        return res.status(403).json({ message: token.message });
      }
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }
};
