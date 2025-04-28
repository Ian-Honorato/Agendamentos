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
