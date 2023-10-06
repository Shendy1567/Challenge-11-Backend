const gameService = require("../services/game.services");

module.exports = class GameControllers {
  async getGameTable(req, res, next) {
    try {
      const data = await gameService.getAllGames();
      return res.status(200).json({
        result: "Success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }
};
