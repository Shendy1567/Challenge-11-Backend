const AuthContollers = require("../../controllers/auth.contoller");
const AuthControl = new AuthContollers();
const AuthRouter = require("express").Router();

AuthRouter.post("/register", AuthControl.registerPlayer);
AuthRouter.post("/login", AuthControl.loginPlayer);
AuthRouter.get("/token", AuthControl.refreshToken);
AuthRouter.delete("/logout", AuthControl.logoutPlayer);

module.exports = AuthRouter;
