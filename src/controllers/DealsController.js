const AppError = require("../utils/AppError");

const knex = require("../database/knex");

class DealsController {
  async index(request, response) {
    const { name, contacts } = request.query;

    const query = knex("deals")
      .select(
        "deals.id",
        "deals.name",
        "deals.value",
        "contacts.name as contact_name",
        "contacts.phone as contact_phone",
        "contacts.email as contact_email"
      )
      .leftJoin("contacts", "deals.contact_id", "contacts.id");

    if (name) {
      query.where("deals.name", "like", `%${name}%`);
    }

    if (contacts) {
      const idsArray = contacts.split(",");
      query.whereIn("deals.contact_id", idsArray);
    }

    const deals = await query;

    const formattedDeals = deals.map((deal) => ({
      id: deal.id,
      name: deal.name,
      value: deal.value,
      contact: deal.contact_name
        ? {
            name: deal.contact_name,
            phone: deal.contact_phone,
            email: deal.contact_email,
          }
        : {},
    }));

    response.json({ deals: formattedDeals });
  }

  async create(request, response) {
    const { name, value, contact_id } = request.body;

    if (!name) {
      throw new AppError("Nome é obrigatório");
    }

    if (value && typeof value != "number") {
      throw new AppError("O campo valor deve ser um número");
    }

    const deals = await knex("deals")
      .insert({ name, value: value ?? 0, contact_id })
      .returning("*");

    return response.json({ message: "Criado com sucesso!", deals });
  }

  async show(request, response) {
    const { id } = request.params;

    let contact = {};

    const deal = await knex("deals").where({ id }).first();

    if (!deal) {
      throw new AppError("Negócio não encontrado!");
    }

    if (deal.contact_id) {
      contact = await knex("contacts")
        .select("name", "phone", "email")
        .where({ id: deal.contact_id })
        .first();
    }

    const data = {
      ...deal,
      contact,
    };

    response.json(data);
  }

  async update(request, response) {
    const { id } = request.params;

    const { name, value, contact_id } = request.body;

    let deal = await knex("deals").where({ id }).first();

    if (!deal) {
      throw new AppError("Negócio não encontrado!");
    }

    if (value && typeof value != "number") {
      throw new AppError("O valor não é válido");
    }

    const updatedDeal = {
      name: name ?? deal.name,
      value: value ?? deal.value,
      contact_id: contact_id ?? deal.contact_id,
    };

    deal = await knex("deals").where({ id }).update(updatedDeal).returning("*");

    return response.json({ message: "Editado com sucesso!", deal });
  }

  async delete(request, response) {
    const { id } = request.params;

    const findDeal = await knex("deals").where({ id }).first();

    if (!findDeal) {
      throw new AppError("Negócio não encontrado!");
    }

    await knex("deals").where({ id }).delete();

    return response.json({ message: "Deletado com sucesso!" });
  }
}

module.exports = DealsController;
