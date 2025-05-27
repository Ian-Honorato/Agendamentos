import conversa from "../models/Conversa";
import {Op} from "sequelize";
import Mensagem from "../models/Mensagem";

class HomeController {
  async store(req, res) {
  
    const {id_conversa, content} = req.body;
    const id_logado = req.userId;

    console.log(id_logado);

    try{
      const conversaExist = await conversa.findOne({
      where: {
        id: id_conversa,
        [Op.or]: [
          { user_remetente: id_logado },
          { user_destinatario: id_logado }
        ]
      }
    });

      if(!conversaExist){
        return res.status(400).json({msg: "Você nao tem permissao para enviar mensagem nesta conversa"});
      }
      const newMensage = await Mensagem.create({
        content,
        conversa_id: id_conversa,
        id_usuario: id_logado,
        
      });

      if (!newMensage){
        return res.status(400).json({msg: "Erro ao enviar mensagem"})

      }
      return res.status(200).json("nova mensagem criada com sucesso")

    }catch (er) {
      console.log(er)
    }
  }
  async findAll(req, res){
    const {id_conversa} = req.params;

    if(!id_conversa){
      return res.status(400).json({msg: "id da conversa não informado"})
    }
    try{
        const showMensages = await Mensagem.findAll({
          where:{conversa_id: id_conversa}
        })

        if(!showMensages){
          return res.status(400).json({msg: "nenhuma mensagem encontrada"})
        }
        return res.status(200).json(showMensages);
    }catch(e){
      console.log(e);
    }
  }
async updateState(req, res) {
  const { id_mensagem } = req.params;
  const id_logado = req.userId;

  if (!id_mensagem) {
    return res.status(400).json({ msg: "ID da mensagem não informado" });
  }

  try {
    const mensagem = await Mensagem.findOne({
      where: { id: id_mensagem }
    });

    if (!mensagem) {
      return res.status(404).json({ msg: "A mensagem não foi localizada" });
    }

    const conversaExist = await conversa.findOne({
      where: {
        id: mensagem.conversa_id,
        [Op.or]: [
          { user_remetente: id_logado },
          { user_destinatario: id_logado }
        ]
      }
    });

    if (!conversaExist) {
      return res.status(403).json({ msg: "Você não tem permissão para ler essa mensagem" });
    }

    if (conversaExist.user_destinatario !== id_logado) {
      return res.status(403).json({ msg: "Apenas o destinatário pode marcar a mensagem como lida" });
    }

    const [updated] = await Mensagem.update(
      { read: true },
      { where: { id: id_mensagem } }
    );

    if (updated === 0) {
      return res.status(400).json({ msg: "Erro ao atualizar o estado da mensagem" });
    }

    return res.status(200).json({
      msg: "O estado da mensagem foi atualizado com sucesso"
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Erro interno no servidor" });
  }
}
}

export default new HomeController();
