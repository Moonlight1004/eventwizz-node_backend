const UserRouter = require("express").Router();
const { register, login, refresh } = require("../controllers/User");
const asyncHandler = require("express-async-handler");

UserRouter.post("/login", asyncHandler((req, res, next) => { return login(req, res); }));

UserRouter.post("/register", asyncHandler((req, res, next) => { return register(req, res); }));

UserRouter.post("/refresh", asyncHandler((req, res, next) => { return refresh(req, res); }));

module.exports = UserRouter;
