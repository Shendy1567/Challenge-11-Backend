const { Score, User } = require("../database/models");

class ScoreRepository {
  async updateScore(id, gameId, score) {
    return Score.create({
      userId: id,
      gameId: gameId,
      score,
    });
  }

  async historyScoreById(id) {
    return await Score.findAll({
      where: {
        userId: id,
      },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });
  }

  async scoreById(id) {
    return Score.findAll({ where: { userId: id } });
  }

  async scoreInGame(id, gameId) {
    return Score.findAll({ where: { userId: id, gameId } });
  }

  async scoreByGameId(gameId) {
    return Score.findAll({ where: { gameId } });
  }

  async scoreWithUser() {
    return await Score.findAll({
      include: User,
    });
  }
}

module.exports = new ScoreRepository();
