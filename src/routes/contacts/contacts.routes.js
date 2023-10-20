const { Router } = require("express");

const contactsRoutes = Router();

const ContactController = require("../../controllers/ContactController");
const contactController = new ContactController();
const ensureAuthenticated = require("../../middleware/ensureAuthenticated");

contactsRoutes.get("/", ensureAuthenticated, contactController.index);
contactsRoutes.post("/", ensureAuthenticated, contactController.create);
contactsRoutes.put("/:id", ensureAuthenticated, contactController.update);
contactsRoutes.delete("/:id", ensureAuthenticated, contactController.delete);

module.exports = contactsRoutes;
