const request = require("supertest");
const app = require("../routes");
const { Score, User, Game } = require("../database/models");
const ScoreController = require("../controllers/score.controller");
const {
  TotalScoreLeaderboard,
  AllScoreById,
  TotalScore,
  TotalScoreInGame,
  UpdateScore,
} = new ScoreController();

describe("Get Leaderboard /api/score/leaderboard", () => {
  it('get all leaderboard from database then return status: 200, result: "Success", and data: [array of score]', async () => {
    const res = await request(app).get("/api/score/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: "Success",
      data: expect.any(Array),
    });
  });

  it("should handle errors on /api/score/leaderboard", async () => {
    Score.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/api/score/leaderboard");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      result: "Error",
      error: "Database error",
    });
  });
});

describe("Get Leaderboard by game id /api/score/leaderboard/:id", () => {
  it("should return the leaderboard data", async () => {
    const req = { params: { gameId: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Sequelize functions for testing
    Score.findAll = jest.fn().mockResolvedValue([{ userId: 1, score: 100 }]);
    User.findOne = jest.fn().mockResolvedValue({ id: 1, username: "testuser" });

    await TotalScoreLeaderboard(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ userId: "1", username: "testuser", score: 100 }],
    });
  });

  it('should return "failed" when there are no scores', async () => {
    const req = { params: { gameId: 100 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Sequelize functions for testing to simulate no scores
    Score.findAll = jest.fn().mockResolvedValue([]);

    await TotalScoreLeaderboard(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: "failed",
      message: "This game didn't have a score",
    });
  });

  it("should handle errors on /api/score/leaderboard/:id", async () => {
    Score.findAll = jest.fn().mockRejectedValue(new Error("Database error"));
    const id = 1;
    const res = await request(app).get(`/api/score/leaderboard/${id}`);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      result: "Error",
      error: "Database error",
    });
  });
});

describe("Get History Score by Id /api/score/history/:id", () => {
  it('get all history score from database by id then return status: 200, result: "Success", and score: [array of score]', async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    Score.findAll = jest.fn().mockResolvedValue([
      { userId: 1, score: 100 },
      { userId: 1, score: 100 },
      { userId: 1, score: 100 },
      { userId: 1, score: 100 },
    ]);
    User.findOne = jest.fn().mockResolvedValue({ id: 1, username: "testuser" });

    await AllScoreById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      result: "Success",
      score: [
        { userId: 1, score: 100 },
        { userId: 1, score: 100 },
        { userId: 1, score: 100 },
        { userId: 1, score: 100 },
      ],
    });
  });

  it('should return "failed" when there are no history', async () => {
    const req = { params: { id: 2 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Sequelize functions for testing to simulate no scores
    Score.findAll = jest.fn().mockResolvedValue([]);

    await AllScoreById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: "failed",
      message: "This player didn't have score",
    });
  });

  it("should handle errors on /api/score/history/:id", async () => {
    Score.findAll = jest.fn().mockRejectedValue(new Error("Database error"));
    const id = 1;
    const res = await request(app).get(`/api/score/history/${id}`);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      result: "Error",
      error: "Database error",
    });
  });
});

describe("Get Total Score by Id /api/score/:id", () => {
  it('get total score from database by id then return status: 200, result: "Success", and the score', async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    Score.findAll = jest.fn().mockResolvedValue([
      { userId: 1, score: 100 },
      { userId: 1, score: 100 },
      { userId: 1, score: 100 },
      { userId: 1, score: 100 },
    ]);
    User.findOne = jest.fn().mockResolvedValue({ id: 1, username: "testuser" });

    await TotalScore(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      result: "Success",
      totalScore: 400,
    });
  });

  it('should return "failed" when there are no score in that player id', async () => {
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Sequelize functions for testing to simulate no scores
    Score.findAll = jest.fn().mockResolvedValue([]);

    await TotalScore(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: "failed",
      message: "This player didn't have score",
    });
  });

  it("should handle errors on /api/score/:id", async () => {
    Score.findAll = jest.fn().mockRejectedValue(new Error("Database error"));
    const id = 1;
    const res = await request(app).get(`/api/score/${id}`);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      result: "Error",
      error: "Database error",
    });
  });
});

describe("Get Total Score in game by Id /api/score/:gameId/:id", () => {
  it('get total score from database by id then return status: 200, result: "Success", and the score', async () => {
    const req = { params: { id: 1, gameId: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    Score.findAll = jest.fn().mockResolvedValue([
      { userId: 1, gameId: 1, score: 100 },
      { userId: 1, gameId: 1, score: 100 },
      { userId: 1, gameId: 1, score: 100 },
      { userId: 1, gameId: 1, score: 100 },
    ]);
    User.findOne = jest.fn().mockResolvedValue({ id: 1, username: "testuser" });

    await TotalScoreInGame(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      result: "Success",
      totalScore: 400,
    });
  });

  it('should return "failed" when there are no score in that player id', async () => {
    const req = { params: { id: 1, gameId: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Sequelize functions for testing to simulate no scores
    Score.findAll = jest.fn().mockResolvedValue([]);

    await TotalScoreInGame(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: "failed",
      message: "This player didn't have score",
    });
  });

  it("should handle errors on /api/score/:gameId/:id", async () => {
    Score.findAll = jest.fn().mockRejectedValue(new Error("Database error"));
    const id = 1;
    const gameId = 1;
    const res = await request(app).get(`/api/score/${gameId}/${id}`);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      result: "Error",
      error: "Database error",
    });
  });
});

describe("Post Score in game by Id /api/score/:gameId/:id", () => {
  it('post score from database by id then return status: 200, result: "Success", and the message win', async () => {
    const req = { params: { id: 1, gameId: 1 }, body: { score: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findByPk = jest.fn().mockResolvedValue({ id: req.params.id });
    Game.findOne = jest.fn().mockResolvedValue({ id: req.params.gameId });

    Score.create = jest.fn().mockResolvedValue({
      userId: req.params.id,
      gameId: req.params.gameId,
      score: req.body.score,
    });

    await UpdateScore(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      result: "Success",
      message: `Player with id: ${req.params.id} win`,
    });
  });

  it('post score from database by id then return status: 200, result: "Success", and the message lost', async () => {
    const req = { params: { id: 1, gameId: 1 }, body: { score: 0 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    User.findByPk = jest.fn().mockResolvedValue({ id: req.params.id });
    Game.findOne = jest.fn().mockResolvedValue({ id: req.params.gameId });

    Score.create = jest.fn().mockResolvedValue({
      userId: req.params.id,
      gameId: req.params.gameId,
      score: req.body.score,
    });

    await UpdateScore(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      result: "Success",
      message: `Player with id: ${req.params.id} lose`,
    });
  });

  it('should return "not Found" when there is no user found', async () => {
    const req = { params: { id: 1, gameId: 1 }, body: { score: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Sequelize functions for testing to simulate no scores
    User.findByPk = jest.fn().mockResolvedValue(null);

    await UpdateScore(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: "Not found",
      message: `Player with id: ${req.params.id} not found`,
    });
  });

  it('should return "not Found" when there is no game found', async () => {
    const req = { params: { id: 1, gameId: 1 }, body: { score: 1 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock the Sequelize functions for testing to simulate no scores
    User.findByPk = jest.fn().mockResolvedValue({ id: req.params.id });

    Game.findOne = jest.fn().mockResolvedValue(null);

    await UpdateScore(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      result: "Not found",
      message: `Game is not exist`,
    });
  });

  it("should handle errors on post /api/score/:gameId/:id", async () => {
    const req = {
      params: { id: 1, gameId: 1 },
      body: { score: 1 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Mock User and Game model functions
    User.findByPk = jest.fn().mockResolvedValue({ id: 1 });
    Game.findOne = jest.fn().mockResolvedValue({ id: 1 });

    // Mock Score.create function to throw an error
    Score.create = jest.fn().mockRejectedValue(new Error("Database error"));

    await UpdateScore(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      result: "Error",
      error: "Database error",
    });
  });
});
