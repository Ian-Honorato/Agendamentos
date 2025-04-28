import jwt from "jsonwebtoken";
import User from "../models/User";
export default async (req, res, next) => {
  const idLogado = req.userId;

  const user = await User.findByPk(idLogado);

  if (!user) {
    return res.status(400).json({ msg: "O usuario nao foi localizado" });
  }
  if (user.dataValues.tipo_usuario != "admin") {
    return res
      .status(400)
      .json({ msg: "o usuario não têm permissão para isso" });
  }

  return next();
};
