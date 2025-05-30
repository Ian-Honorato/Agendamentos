import { where } from "sequelize";
import User from "../models/User";
import bcrypt from "bcryptjs";
class UserController {
  async index(req, res) {
    const users = await User.findAll();
    if (!users) {
      return res.json({ msg: "Nenhum usuario cadastrado" });
    }
    return res.status(200).json(users);
  }
  async store(req, res) {
    const { nome, email, senha, data_nascimento, tipo_usuario, contatos } =
      req.body;

    if (!nome || !email || !senha || !data_nascimento) {
      return res
        .status(400)
        .json({ msg: "Todos os campos devem ser preenchidos" });
    }
    const verifyEmail = await User.findOne({
      where: { email: email },
    });
    if (verifyEmail) {
      return res.json({ msg: "email já cadastrado" });
    }

    const functionDate = (data_nascimento) => {
      if (!data_nascimento) return null;

      //true ou false
      if (data_nascimento.includes("/") && data_nascimento.length === 10) {
        const [dia, mes, ano] = data_nascimento.split("/");
        return `${ano}-${mes}-${dia}`;
      }

      if (data_nascimento.includes("-") && data_nascimento.length === 10) {
        return data_nascimento;
      }

      console.error("Formato de data inválido:", data_nascimento);
      return null;
    };
    const dataFormatada = functionDate(data_nascimento);

    if (!dataFormatada || dataFormatada === null) {
      return res.json({ msg: "data invalida" });
    }

    const user = await User.create({
      nome,
      email,
      senha,
      data_nascimento: dataFormatada,
      tipo_usuario,
    });
    if (!user) {
      return res.json({ msg: "Erro ao realizar o cadastro" });
    }
    return res.status(201).json({
      msg: "Usuário cadastrado com Sucesso!",
      Usuario: user,
    });
  }
  async update(req, res) {
    try {
      const { id } = req.params;

      const verifyUser = await User.findByPk(id);
      /*       console.log();
      console.log();
      console.log(verifyUser); */

      if (!verifyUser) {
        return res.status(400).json({
          mensagem: "Usuario não localizado",
        });
      }
      const { nome, sobrenome, email, senha } = req.body;

      if (!nome || !sobrenome || !email || !senha) {
        return res.status(400).json({
          mensagem: "Todos os campos devem ser preenchidos",
        });
      }
      let senhaHash = await bcrypt.hash(senha, 8);

      const [updateUser] = await User.update(
        { nome, sobrenome, email, senha: senhaHash },
        {
          where: { id },
        }
      );

      //console.log(updateUser);
      //retona o numero de linhas afetadas;
      if (updateUser === 0) {
        return res.status(400).json({
          mensagem: "Erro ao atualizar o usuario",
        });
      }

      return res.status(200).json({
        mensagem: "Dados atualizados com sucesso",
      });
    } catch (e) {
      console.log(e);
    }
  }
  async destroy(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          mensagem: "Id não localizado",
        });
      }
      const userDelete = await User.destroy({
        where: { id },
      });
      if (!userDelete) {
        return res.status(400).json({
          mensagem: "Erro ao deletar usuario",
        });
      }
      return res.status(200).json({
        mensagem: "Usuario removido com sucesso!",
      });
    } catch (e) {
      console.log(e);
    }
  }
  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          error: "é necessario o Id",
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(400).json({
          error: "O usuario não foi localizado!",
        });
      }

      res.status(200).json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        error: "Ocorreu um erro" + e,
      });
    }
  }
}
export default new UserController();
