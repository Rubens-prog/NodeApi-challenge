const { Router } = require("express");

const sessionsRoutes = require("./sessions/sessions.routes");
const usersRoutes = require("./users/users.routes");
const contactsRoutes = require("./contacts/contacts.routes");
const dealsRoutes = require("./deals/deals.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/contacts", contactsRoutes);
routes.use("/deals", dealsRoutes);

module.exports = routes;
