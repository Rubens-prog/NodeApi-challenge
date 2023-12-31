exports.up = (knex) =>
  knex.schema
    .createTable("contacts", (table) => {
      table.increments("id");
      table.text("name").notNullable();
      table.text("email");
      table.text("phone");
      table.timestamp("created_at").default(knex.fn.now());
      table.timestamp("updated_at").default(knex.fn.now());
    })
    .createTable("deals", (table) => {
      table.increments("id");
      table.text("name").notNullable();
      table.decimal("value", 10, 2).notNullable();

      table
        .integer("contact_id")
        .unsigned()
        .references("id")
        .inTable("contacts");

      table.timestamp("created_at").default(knex.fn.now());
      table.timestamp("updated_at").default(knex.fn.now());
    });

exports.down = (knex) => knex.schema.dropTable("contacts");
