const scoreServices = require("../services/score.services");
const playerServices = require("../services/player.services");
const gameServices = require("../services/game.services");

module.exports = class ScoreControllers {
  async UpdateScore(req, res, next) {
    try {
      const { id, gameId } = req.params;
      const { score } = req.body;
      const player = await playerServices.getPlayerById(id);
      const game = await gameServices.getGameByid(gameId);
      if (!player)
        return res.status(404).json({
          result: "Not found",
          message: `Player with id: ${id} not found`,
        });
      if (!game)
        return res.status(404).json({
          result: "Not found",
          message: `Game is not exist`,
        });

      if (player && game) {
        const getScore = await scoreServices.updateScore(id, gameId, score);
        if (getScore) {
          if (score === 1) {
            return res.status(200).json({
              result: "Success",
              message: `Player with id: ${id} win`,
            });
          } else if (score === 0) {
            return res.status(200).json({
              result: "Success",
              message: `Player with id: ${id} lose`,
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }

  async AllScoreById(req, res, next) {
    try {
      const { id } = req.params;
      const score = await scoreServices.historyScoreById(id);
      if (score.length === 0) {
        return res.status(404).json({
          result: "failed",
          message: "This player didn't have score",
        });
      } else {
        return res.status(200).json({
          result: "Success",
          score,
        });
      }
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }

  async TotalScore(req, res, next) {
    try {
      const { id } = req.params;
      const score = await scoreServices.scoreById(id);

      if (!score.success) {
        return res.status(404).json({
          result: "failed",
          message: score.message,
        });
      } else {
        return res.status(200).json({
          result: "Success",
          totalScore: score.totalScore,
        });
      }
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }

  async TotalScoreInGame(req, res, next) {
    try {
      const { id, gameId } = req.params;
      const score = await scoreServices.scoreByGameId(id, gameId);
      if (!score.success) {
        return res.status(404).json({
          result: "failed",
          message: score.message,
        });
      } else {
        return res.status(200).json({
          result: "Success",
          totalScore: score.totalScore,
        });
      }
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }

  async Leaderboard(req, res, next) {
    try {
      const leaderboard = await scoreServices.leaderboard();

      return res.status(200).json({
        status: "Success",
        data: leaderboard.result,
      });
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }

  async TotalScoreLeaderboard(req, res, next) {
    try {
      const { gameId } = req.params;

      const scores = await scoreServices.TotalScoreLeaderboard(gameId);
      if (!scores.success) {
        return res.status(404).json({
          result: "failed",
          message: scores.message,
        });
      } else {
        return res.status(200).json({
          data: scores.data,
        });
      }
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }
};
