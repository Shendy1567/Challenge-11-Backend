"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: `userId`,
        onDelete: "CASCADE",
      });

      this.belongsTo(models.Game, {
        foreignKey: "gameId",
        onDelete: "CASCADE",
      });
    }
  }
  Score.init(
    {
      userId: DataTypes.INTEGER,
      gameId: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Score",
    }
  );
  return Score;
};
