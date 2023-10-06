const AuthController = require("../controllers/auth.contoller");
const { registerPlayer, loginPlayer, refreshToken, logoutPlayer } =
  new AuthController();
const { hashPassword, verifyPassword } = require("../utils/passwordHandler");
const jwt = require("jsonwebtoken");
const { User } = require("../database/models");

jest.mock("../utils/passwordHandler");
jest.mock("jsonwebtoken");

describe("Register new User /api/auth/register", () => {
  it("post new user to database then return status: 200, msg: register berhasil", async () => {
    const req = {
      body: {
        username: "test",
        email: "test@email.com",
        password: "tested",
        confPassword: "tested",
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(null);
    const newPassword = await hashPassword(req.body.password);
    User.create = jest.fn().mockResolvedValue({
      username: req.body.username,
      email: req.body.email,
      password: newPassword,
      role: "user",
      profile_image_url: "test picture",
    });

    await registerPlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "player register is succeed",
      success: true,
    });
  });

  it("should return status 400 because email is already used", async () => {
    const req = {
      body: {
        username: "test",
        email: "test@email.com",
        password: "tested",
        confPassword: "tested",
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest
      .fn()
      .mockResolvedValue({ where: { email: req.body.email } });
    const newPassword = await hashPassword(req.body.password);
    User.create = jest.fn().mockResolvedValue({
      username: req.body.username,
      email: req.body.email,
      password: newPassword,
      role: "user",
      profile_image_url: "test picture",
    });

    await registerPlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email sudah digunakan",
      success: false,
    });
  });

  it("should return status 400 because password and the confirmation is not the same", async () => {
    const req = {
      body: {
        username: "test",
        email: "test@email.com",
        password: "tested",
        confPassword: "notsame",
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(null);
    const newPassword = await hashPassword(req.body.password);
    User.create = jest.fn().mockResolvedValue({
      username: req.body.username,
      email: req.body.email,
      password: newPassword,
      role: "user",
      profile_image_url: "test picture",
    });

    await registerPlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password tidak sama",
      success: false,
    });
  });

  it("should handle errors on post /api/auth/register", async () => {
    const req = {
      body: {
        username: "test",
        email: "test@email.com",
        password: "tested",
        confPassword: "tested",
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockRejectedValue(new Error("Database error"));

    await registerPlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      result: "Error",
      error: "Error connection to database: Database error",
    });
  });
});

describe("Login User /api/auth/login", () => {
  it("post user username and password for login to database then return status: 200 and the access token", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "tested",
      },
    };

    const mockUser = {
      id: 1,
      username: "test",
      email: "test@example.com",
      password: "hashedPassword",
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      cookie: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    verifyPassword.mockResolvedValue(true);

    jest.spyOn(jwt, "sign").mockReturnValue("mockedAccessToken");

    await loginPlayer(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: mockUser.id,
        userUsername: mockUser.username,
        userEmail: mockUser.email,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "20s" }
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: mockUser.id,
        userUsername: mockUser.username,
        userEmail: mockUser.email,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "1d" }
    );

    expect(res.cookie).toHaveBeenCalledWith(
      "refreshToken",
      "mockedAccessToken",
      {
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ accessToken: "mockedAccessToken" });
  });

  it("password is not matching so return status 400 and msg password salah", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "tested",
      },
    };

    const mockUser = {
      id: 1,
      username: "test",
      email: "test@example.com",
      password: "hashedPassword",
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    verifyPassword.mockResolvedValue(false);

    await loginPlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "wrong password" });
  });

  it("should handle errors on post /api/auth/login", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "tested",
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockRejectedValue(new Error("Database error"));

    verifyPassword.mockResolvedValue(true);

    await loginPlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Email tidak ditemukan",
    });
  });
});

describe("Logout User /api/auth/logout", () => {
  it("it should logging out user and clear its refresh token", async () => {
    const req = {
      cookies: { refreshToken: "mockRefreshToken" },
    };

    const mockUser = {
      id: 1,
      refresh_token: "mockRefreshToken",
    };

    const res = {
      sendStatus: jest.fn(),
      clearCookie: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    await logoutPlayer(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
    expect(res.sendStatus).toHaveBeenCalledWith(200);
  });

  it("it's not logging out user because didnt have token", async () => {
    const req = {
      cookies: { refreshToken: null },
    };

    const mockUser = {
      id: 1,
      refresh_token: "mockRefreshToken",
    };

    const res = {
      sendStatus: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    await logoutPlayer(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("it's not logging out user because token is different", async () => {
    const req = {
      cookies: { refreshToken: "different Token" },
    };

    const res = {
      sendStatus: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(null);

    await logoutPlayer(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
});

describe("Load RefreshToken /api/auth/token", () => {
  it("it make new refresh token that can be used", async () => {
    const req = {
      cookies: { refreshToken: "mockRefreshToken" },
    };

    const mockUser = {
      id: 1,
      username: "test",
      email: "test@example.com",
      picture: "test picture",
      refresh_token: "mockRefreshToken",
    };

    const res = {
      clearCookie: jest.fn(),
      status: jest.fn(),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    const decodedToken = {
      userId: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      picture: mockUser.profile_image_url,
    };

    const verify = jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decodedToken);
    });

    console.log(verify);
    await refreshToken(req, res);

    jest.spyOn(jwt, "sign").mockReturnValue("mockedAccessToken");

    expect(res.json).toHaveBeenCalledWith({ accessToken: "mockedAccessToken" });
  });

  it("it didnt make new token because didnt have token", async () => {
    const req = {
      cookies: { refreshToken: null },
    };

    const mockUser = {
      id: 1,
      username: "test",
      email: "test@example.com",
      picture: "test picture",
      refresh_token: "mockRefreshToken",
    };

    const res = {
      sendStatus: jest.fn(() => res),
      json: jest.fn(),
      clearCookie: jest.fn(),
    };

    User.findOne = jest.fn().mockResolvedValue(mockUser);

    const decodedToken = {
      userId: mockUser.id,
      username: mockUser.username,
      email: mockUser.email,
      picture: mockUser.profile_image_url,
    };

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decodedToken);
    });

    await refreshToken(req, res);

    jest.spyOn(jwt, "sign").mockReturnValue("mockedAccessToken");

    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  it("it didnt make new token because user didnt found", async () => {
    const req = {
      cookies: {
        refreshToken: "invalidRefreshToken",
      },
    };

    const res = {
      sendStatus: jest.fn(),
      clearCookie: jest.fn(),
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne.mockResolvedValue(null);

    await refreshToken(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith("refreshToken");
  });

  it("it didnt make new token because jwt verify error", async () => {
    const req = {
      cookies: {
        refreshToken: "validRefreshToken",
      },
    };

    const res = {
      sendStatus: jest.fn(),
      clearCookie: jest.fn(),
      status: jest.fn(() => res),
      json: jest.fn(),
      message: jest.fn(),
    };

    const mockUser = {
      id: 1,
      username: "test",
      email: "test@example.com",
      picture: "test picture",
      refresh_token: "mockRefreshToken",
    };

    User.findOne.mockResolvedValue(mockUser);

    jest.spyOn(jwt, "verify").mockImplementation((token, secret, callback) => {
      callback(new Error("Token verification failed"));
    });

    const result = await refreshToken(req, res);

    expect(result).toEqual({ success: false, message: "token error" });
  });

  it("should handle errors on post /api/auth/token", async () => {
    const req = {
      cookies: {
        refreshToken: "validRefreshToken",
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      result: "Error",
      error: "Error connection to database: Database error",
    });
  });
});
