const authController = require("../middleware/authCheck");
const { authVerify } = new authController();
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("authVerify Function Tests", () => {
  it("should verify a valid token and call next()", () => {
    const req = {
      headers: {
        authorization: "Bearer validToken",
      },
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { email: "user@example.com" });
    });

    authVerify(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should handle missing token with a 401 status", () => {
    const req = {
      headers: {},
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    authVerify(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle invalid token with a 403 status", () => {
    const req = {
      headers: {
        authorization: "Bearer invalidToken",
      },
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"));
    });

    authVerify(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
