import User from "../models/User";
class HomeController {
  async index(req, res) {
    return res
      .status(200)
      .json({ msg: "colocar as rotas para navegar na aplicação" });
  }
}
export default new HomeController();
