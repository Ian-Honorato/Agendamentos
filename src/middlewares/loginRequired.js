import jwt from "jsonwebtoken";
import User from "../models/User";
export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ msg: "Necessário token" });
  }
  const [, token] = authorization.split(" ");

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { id, email } = dados;

    const user = await User.findOne({ where: { id, email } });

    if (!user) {
      return res.status(400).json({
        msg: "o usuario não foi encontrado, email ou senha nao conferem",
      });
    }
    req.userId = id;
    req.userEmail = email;

    return next();
  } catch (e) {
    return res.status(401).json({ msg: "token expirado ou invalido" });
  }
};
