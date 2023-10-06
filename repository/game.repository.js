const { Game } = require("../database/models");

class GameRepository {
  async getAllGames() {
    return await Game.findAll();
  }

  async getGamebyid(gameId) {
    return await Game.findOne({ where: { id: gameId } });
  }
}

module.exports = new GameRepository();
