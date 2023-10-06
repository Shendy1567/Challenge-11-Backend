const { User } = require("../database/models");

class PlayerRepository {
  async createUser(username, email, password, role, profileImageUrl) {
    return User.create({
      username,
      email,
      password,
      role,
      profile_image_url: profileImageUrl,
    });
  }

  async getPlayerById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async findByToken(refreshToken) {
    return User.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
  }

  async updatePlayer(id, updateFields) {
    return await User.update(updateFields, { where: { id } });
  }

  async updateToken(refreshToken, id) {
    return await User.update(
      { refresh_token: refreshToken },
      { where: { id } }
    );
  }
}

module.exports = new PlayerRepository();
