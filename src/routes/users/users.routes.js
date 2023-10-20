const { Router } = require("express");

const usersRoutes = Router();

const UsersController = require("../../controllers/UsersController");

const usersController = new UsersController();

const ensureAuthenticated = require("../../middleware/ensureAuthenticated");

usersRoutes.get("/", usersController.index);
usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.delete("/:id", ensureAuthenticated, usersController.delete);

module.exports = usersRoutes;
