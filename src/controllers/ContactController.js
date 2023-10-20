const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class ContactController {
  async index(request, response) {
    const { name, email } = request.query;

    const query = knex("contacts").select("*");

    if (name) {
      query.where("name", "like", `%${name}%`);
    }
    if (email) {
      query.where("email", "like", `%${email}%`);
    }

    query.limit(10);

    const contacts = await query;

    return response.json(contacts);
  }

  async create(request, response) {
    const { name, email, phone } = request.body;

    if (!name) {
      throw new AppError("O nome é obrigatório!");
    }
    await knex("contacts").insert({ name, email, phone });

    return response.json({
      message: "Criado com suucesso!",
    });
  }

  async update(request, response) {
    const { name, email, phone } = request.body;

    const { id } = request.params;

    let contact = await knex("contacts").where({ id }).first();

    if (!contact) {
      throw new AppError("contact não encontrado", 400);
    }

    const updatedContact = {
      name: name || contact.name,
      email: email || contact.email,
      phone: phone || contact.phone,
    };

    contact = await knex("contacts")
      .where({ id })
      .update(updatedContact)
      .returning("*");

    return response.json({ message: "Editado com sucesso!", contact });
  }

  async delete(request, response) {
    const { id } = request.params;

    const contactExists = await knex("contacts").where({ id }).first();

    if (!contactExists) {
      throw new AppError("Contacto não encontrado!");
    }

    await knex("contacts").where({ id }).delete();

    return response.json({ message: "Deletado com sucesso!" });
  }
}

module.exports = ContactController;
