const request = require("supertest");
const app = require("../routes");
const { Game } = require("../database/models");

describe("GetAllGames /api/game", () => {
  it('get all games from database then return status: 200, result: "Success", and data: [array of games]', async () => {
    expect.assertions(2);
    const res = await request(app).get("/api/game");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      result: "Success",
      data: expect.any(Array),
    });
  });

  it("should handle errors in getGameTable", async () => {
    Game.findAll = jest.fn().mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/api/game");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      result: "Error",
      error: "Error fetching all users: Database error",
    });
  });
});
