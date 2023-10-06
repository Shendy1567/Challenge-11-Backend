const playerService = require("../services/player.services");

module.exports = class PlayerControllers {
  async getPlayerById(req, res, next) {
    try {
      const { id } = req.params;
      const player = await playerService.getPlayerById(id);
      if (player) {
        return res.status(200).json({
          status: "Success",
          data: player,
        });
      } else {
        return res.status(404).json({
          result: "Not found",
          message: `Player with ${id} not found`,
        });
      }
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }

  async updatePlayer(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;
      const data = await playerService.getPlayerById(id);

      if (!data)
        return res.status(404).json({
          result: "Not found",
          message: `Player with id: ${id} not found`,
        });

      const result = await playerService.updatePlayer(
        id,
        username,
        email,
        password
      );

      return res.status(200).json({
        result: "Success",
        message: result.message,
      });
    } catch (error) {
      return res.status(500).json({
        result: "Error",
        error: error.message,
      });
    }
  }
};
