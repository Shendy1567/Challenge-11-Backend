const GameController = require("../../controllers/game.controller");
const GameControl = new GameController();
const GameRouter = require("express").Router();

GameRouter.get("/", GameControl.getGameTable);

module.exports = GameRouter;
