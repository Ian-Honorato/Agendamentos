import { Contato, User } from "../models/index";

class ContatoController {
  async show(req, res) {
    try {
      const usersContato = await Contato.findAll({
        attributes: ["id", "numero", "whatsapp", "usuario_id"],
      });

      if (usersContato.length == 0) {
        return res.status(400).json({
          msg: "Nenhnum contato localizado",
        });
      } else {
        return res.status(200).json(usersContato);
      }
    } catch (e) {
      console.log(e);
    }
  }
  async store(req, res) {
    const { id } = req.params;
    const { numero, whatsapp } = req.body;

    if (!id && !numero && !whatsapp) {
      return res.status(400).json({
        msg: "Campos invalidos",
      });
    }
    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(400).json({
          msg: "O usuario nao foi localizado",
        });
      }
      const contato = await Contato.create({
        numero,
        whatsapp,
        usuario_id: id,
      });
      if (!contato) {
        return res.status(400).json({
          msg: "O contato nao foi criado",
        });
      }
      return res.status(200).json(contato);
    } catch (e) {
      console.log(e);
    }
  }
  async update(req, res) {
    const { id } = req.params;
    const { numero, whatsapp } = req.body;
    if (!id && !numero && !whatsapp) {
      return res.status(400).json({
        msg: "Campos invalidos",
      });
    }
    try {
      //id do numero, nao do usuario
      const contato = await Contato.findByPk(id);

      if (!contato) {
        return res.status(400).json({
          msg: "O numero de contato nao foi localizado",
        });
      } else {
        const updateContato = await contato.update(
          {
            numero,
            whatsapp,
          },
          {
            where: { id },
          }
        );
        if (!updateContato) {
          return res.status(400).json({
            msg: "O contato não foi atualizado",
          });
        } else {
          return res.status(200).json(updateContato);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  async destroy(req, res) {
    const { id } = req.params;
    try {
      const numeroContato = await Contato.findByPk(id);
      if (!numeroContato) {
        return res.status(400).json({
          msg: "O contato nao foi localizado",
        });
      } else {
        const destroyContato = await Contato.destroy({
          where: { id },
        });
        if (!destroyContato) {
          return res.status(400).json({
            msg: "o contato não foi removido!",
          });
        } else {
          return res.status(200).json({
            msg: "O contato foi removido com sucesso!",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
export default new ContatoController();
