const gameRepository = require("../repository/game.repository");

class GameService {
  async getAllGames() {
    try {
      return await gameRepository.getAllGames();
    } catch (error) {
      throw new Error("Error fetching all users: " + error.message);
    }
  }

  async getGameByid(gameId) {
    try {
      return await gameRepository.getGamebyid(gameId);
    } catch (error) {
      throw new Error("Error fetching all users: " + error.message);
    }
  }
}

module.exports = new GameService();
