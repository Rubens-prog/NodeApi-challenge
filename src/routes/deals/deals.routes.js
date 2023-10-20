const { Router } = require("express");

const dealsRoutes = Router();

const DealsController = require("../../controllers/DealsController");
const dealsController = new DealsController();
const ensureAuthenticated = require("../../middleware/ensureAuthenticated");

dealsRoutes.use(ensureAuthenticated);

dealsRoutes.get("/", dealsController.index);
dealsRoutes.get("/:id", dealsController.show);
dealsRoutes.post("/", dealsController.create);
dealsRoutes.put("/:id", dealsController.update);
dealsRoutes.delete("/:id", dealsController.delete);

module.exports = dealsRoutes;
