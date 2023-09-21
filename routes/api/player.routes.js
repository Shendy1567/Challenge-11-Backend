const PlayerController = require("../../controllers/player.controller");
const PlayerControl = new PlayerController();
const playerRouter = require("express").Router();
const AuthCheckMiddleware = require("../../middleware/authCheck");
const AuthMiddleware = new AuthCheckMiddleware();


playerRouter.get("/:id", AuthMiddleware.authVerify, PlayerControl.getPlayerById);
playerRouter.put("/:id", PlayerControl.updatePlayer);

module.exports = playerRouter;