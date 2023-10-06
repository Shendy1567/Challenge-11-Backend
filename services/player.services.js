const playerRepository = require("../repository/player.repository");
const { hashPassword } = require("../utils/passwordHandler");

class GameServices {
  async getPlayerById(id) {
    try {
      return await playerRepository.getPlayerById(id);
    } catch (error) {
      throw new Error("Error fetching all users: " + error.message);
    }
  }

  async updatePlayer(id, username, email, password) {
    try {
      const player = await playerRepository.getPlayerById(id);

      if (!player) {
        throw new Error(`Player with id: ${id} not found`);
      }

      const updateFields = {};
      if (username) {
        updateFields.username = username;
      }

      if (email) {
        updateFields.email = email;
      }

      if (password) {
        updateFields.password = await hashPassword(password);
      }
      await playerRepository.updatePlayer(id, updateFields);

      return { message: `Player with id: ${id} successfully updated` };
    } catch (error) {
      throw new Error("Error fetching all users: " + error.message);
    }
  }
}

module.exports = new GameServices();
