const PlayerController = require("../controllers/player.controller");
const { getPlayerById, updatePlayer } = new PlayerController();
const { User } = require("../database/models");

describe("GetPlayerById /api/player/:id", () => {
  it("return player data is success and get player data", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findByPk = jest.fn().mockResolvedValue([
      {
        id: req.params.id,
        username: "test",
        email: "test@gmail.com",
        password: "test123",
      },
    ]);

    await getPlayerById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "Success",
      data: [
        {
          id: req.params.id,
          username: "test",
          email: "test@gmail.com",
          password: "test123",
        },
      ],
    });
  });

  it("didn't return player data result not found and the message", async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findByPk = jest.fn().mockResolvedValue(null);

    await getPlayerById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: "Not found",
      message: `Player with ${req.params.id} not found`,
    });
  });

  it("should handle errors on /api/player/:id", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

    await getPlayerById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      result: "Error",
      error: "Error fetching all users: Database error",
    });
  });
});

describe("updatePlayer Function Tests", () => {
  it("should update a player and return a success message", async () => {
    const req = {
      params: { id: 1 },
      body: {
        username: "newUsername",
        email: "newemail@example.com",
        password: "newPassword",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findByPk = jest.fn().mockResolvedValue({ id: req.params.id });

    User.update = jest.fn().mockResolvedValue([1]);

    await updatePlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      result: "Success",
      message: "Player with id: 1 successfully updated",
    });
  });

  it("should handle player not found with a 404 status", async () => {
    const req = {
      params: { id: 2 },
      body: { username: "newUsername" },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findByPk = jest.fn().mockResolvedValue(null);

    await updatePlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: "Not found",
      message: "Player with id: 2 not found",
    });
  });

  it("should handle database error with a 500 status", async () => {
    const req = {
      params: { id: 1 },
      body: { username: "newUsername" },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findByPk = jest.fn().mockResolvedValue({ id: 1 });

    User.update = jest.fn().mockRejectedValue(new Error("Database error"));

    await updatePlayer(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      result: "Error",
      error: "Error fetching all users: Database error",
    });
  });
});
