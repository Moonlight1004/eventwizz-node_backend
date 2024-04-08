const defaultRoutes = require("express").Router();
const UserRouter = require("./user.js");


defaultRoutes.get("/", (req, res) => {
  res.send("Let's build a CRUD API!");
});

defaultRoutes.use("/user", UserRouter);

module.exports = defaultRoutes;

