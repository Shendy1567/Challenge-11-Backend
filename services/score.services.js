const scoreRepository = require("../repository/score.repository");
const playerRepository = require("../repository/player.repository");

class ScoreServices {
  async updateScore(id, gameId, score) {
    try {
      await scoreRepository.updateScore(id, gameId, score);
      return { success: true };
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async historyScoreById(id) {
    try {
      return await scoreRepository.historyScoreById(id);
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async scoreById(id) {
    try {
      const score = await scoreRepository.scoreById(id);
      if (score.length === 0) {
        return { success: false, message: "This player didn't have score yet" };
      }
      let scoreArr = [];
      score.forEach((score) => {
        scoreArr.push(score.score);
      });
      return {
        success: true,
        totalScore: scoreArr.reduce((partialSum, a) => partialSum + a),
      };
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async scoreByGameId(id, gameId) {
    try {
      const score = await scoreRepository.scoreInGame(id, gameId);
      if (score.length === 0) {
        return { success: false, message: "This player didn't have score yet" };
      }
      let scoreArr = [];
      score.forEach((score) => {
        scoreArr.push(score.score);
      });
      return {
        success: true,
        totalScore: scoreArr.reduce((partialSum, a) => partialSum + a),
      };
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async leaderboard() {
    try {
      const score = await scoreRepository.scoreWithUser();
      let result = [];

      score.reduce(function (res, value) {
        if (!res[value.userId]) {
          res[value.userId] = { userId: value.userId, score: 0, username: "" };
          result.push(res[value.userId]);
        }
        res[value.userId].score += value.score;
        res[value.userId].username = value.User.username;
        return res;
      }, {});

      result.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

      return { success: true, result };
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }

  async TotalScoreLeaderboard(gameId) {
    try {
      const scores = await scoreRepository.scoreByGameId(gameId);
      if (scores.length === 0) {
        return { success: false, message: "This game didn't have a score" };
      } else {
        const userScores = {};

        scores.forEach((score) => {
          if (!userScores[score.userId]) {
            userScores[score.userId] = 0;
          }
          userScores[score.userId] += score.score;
        });

        const userScoresArray = [];

        for (const userId of Object.keys(userScores)) {
          const player = await playerRepository.getPlayerById(userId);

          userScoresArray.push({
            userId,
            username: player.username,
            score: userScores[userId],
          });
        }
        return {
          success: true,
          data: userScoresArray.sort((a, b) => b.score - a.score),
        };
      }
    } catch (error) {
      throw new Error("Error connection to database: " + error.message);
    }
  }
}

module.exports = new ScoreServices();
