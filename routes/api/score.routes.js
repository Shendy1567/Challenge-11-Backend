const ScoreController = require("../../controllers/score.controller");
const ScoreControl = new ScoreController();
const ScoreRouter = require("express").Router();

ScoreRouter.get("/leaderboard/:gameId", ScoreControl.TotalScoreLeaderboard);
ScoreRouter.get("/leaderboard", ScoreControl.Leaderboard);
ScoreRouter.get("/history/:id", ScoreControl.AllScoreById);
ScoreRouter.get("/:gameId/:id", ScoreControl.TotalScoreInGame);
ScoreRouter.post("/:gameId/:id", ScoreControl.UpdateScore);
ScoreRouter.get("/:id", ScoreControl.TotalScore);

module.exports = ScoreRouter;
