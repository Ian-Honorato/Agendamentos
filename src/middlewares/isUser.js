import jwt from "jsonwebtoken";
import User from "../models/User";
export default async (req, res, next) => {
  try {
    const idLogado = req.userId;
    const { id } = req.params;

    const user = await User.findByPk(idLogado, {
      attributes: ["id", "tipo_usuario"],
    });

    if (!user) {
      return res.status(400).json({ msg: "O usuario nao foi localizado" });
    }

    if (user.dataValues.tipo_usuario == "admin" || idLogado == id) {
      return next();
    } else {
      return res
        .status(400)
        .json({ msg: "o usuario nao tem permissao para isso" });
    }
  } catch (e) {
    console.log(e);
  }
};

/* Aqui verifica se o usuario que esta logado é o admin ou se ele tem permissao(ele mesmo)
 Exemplo: alterar o telefone, so o admin e o proprio usuario podem alterar o telefone
*/