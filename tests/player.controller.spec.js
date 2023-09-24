const request = require("supertest");
const app = require("../routes");
const { User } = require("../database/models");

describe("GetPlayerById /api/player/:id", () => {
  it("return player data is unauthorized because didn't have token", async () => {
    const id = 1;
    const res = await request(app).get(`/api/player/${id}`);

    expect(res.status).toBe(401);
    expect(res.text).toBe("Unauthorized");
  });

  it("return player data is success and get player data", async () => {
    const id = 1;
    const res = await request(app).get(`/api/player/${id}`);

    expect(res.status).toBe(401);
    expect(res.text).toBe("Unauthorized");
  });

  it("return player data is not found", async () => {
    const id = 1000;

    const res = await request(app).get(`/api/player/${id}`);

    expect(res.status).toBe(404);
    expect(res.text).toBe("Unauthorized");
  });
});
