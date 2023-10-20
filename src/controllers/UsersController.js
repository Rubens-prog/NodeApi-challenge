const AppError = require("../utils/AppError");
const { hash, compare } = require("bcrypt");

const knex = require("../database/knex");

class UsersController {
  async index(request, response) {
    const { id } = request.query;
    const user = await knex("users").where({ id }).first();

    return response.json({ user });
  }
  async create(request, response) {
    const { name, email, password } = request.body;

    const checkIfUserExists = await knex("users").where({ email }).first();

    if (checkIfUserExists) {
      throw new AppError("Esse email já está em uso!");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({ name, email, password: hashedPassword });

    return response.json({ message: "Salvo com seucesso!" });
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    if (email) {
      const userWithUpdatedEmail = await knex("users").where({ email }).first();

      if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
        throw new AppError("Este e-mail já está em uso.");
      }
    }

    if (password && !old_password) {
      throw new AppError("Você precisa informar a antiga senha!");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A antiga senha não confere!");
      }

      user.password = await hash(password, 8);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await knex("users").where({ id: user_id }).update({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    return response.json({ message: "Editado com sucesso!" });
  }

  async delete(request, response) {
    const { id } = request.params;

    const findUser = await knex("users").where({ id }).first();

    if (!findUser) {
      throw new AppError("Usuário não econtrado!");
    }

    await knex("users").where({ id }).delete();

    return response.json({ message: "Excluído com sucesso!" });
  }
}

module.exports = UsersController;
