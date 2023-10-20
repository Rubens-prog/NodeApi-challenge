const path = require("path");

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "rubilu-crm",
      user: "postgres",
      password: "123",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(
        __dirname,
        "src",
        "database",
        "knex",
        "migrations"
      ),
    },
    useNullAsDefault: true,
  },
};
