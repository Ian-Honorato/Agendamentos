import User from "../models/User";
import jwt from "jsonwebtoken";
class TokenController {
  async store(req, res) {
    const { email = "", senha = "" } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ msg: "Todos os campos devem ser preenchidos" });
    }
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: "O usuario nao foi localizado" });
    }

    let validaSenha = await user.passwordIsValid(senha);

    if (!validaSenha) {
      return res.status(400).json({ msg: "Senha incorreta" });
    }
    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.status(200).json({ token: token });
  }
}
export default new TokenController();
