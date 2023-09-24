const { Game } = require("../database/models");

module.exports = class GameControllers {
  async getGameTable(req, res, next) {
    try {
      const data = await Game.findAll();
      if (data) {
        return res.status(200).json({
          result: "Success",
          data,
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
