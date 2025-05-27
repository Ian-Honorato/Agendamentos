import conversa from "../models/Conversa";
import user from "../models/User";
import Mensagem from "../models/Mensagem";
import {Op} from "sequelize";

class conversaCrontroller {
  async showAll(req, res) {
    
    const usuario_logado = req.userId; // usuario logado

    const conversas = await conversa.findAll({
      where:{
        [Op.or]:[
          
          { user_remetente: usuario_logado},
          { user_destinatario: usuario_logado }
          
        ]
      }
    })
      if(!conversas || conversas.length === 0){
        return res.status(200).json({msg: "Nenhuma conversa encontrada"})
      }

    return res
      .status(200)
      .json(conversas);
  }

  async store(req, res){
    const { userDestinatario, content} = req.body
    const idRemetente = req.userId; // usuario logado

    if(!userDestinatario){
      return res.status(400).json({msg: "É necessário enviar o destinatário"})
    }
    if(!content){
      return res.status(400).json({msg: "É necessário enviar um contúdo na mensagem"});
    }
   
    try{
      const destinatario = await user.findOne({ where: { id: userDestinatario } });

      if(!destinatario){
        return res.status(400).json({msg: "usuario nao encontrado"})
      }


      const verificaConversa =await conversa.findOne({
        where:{
          [Op.or]:[
            
            { user_remetente: idRemetente, user_destinatario: userDestinatario },
            { user_remetente: userDestinatario, user_destinatario: idRemetente }
            
          ]
        }
      });

      if(!verificaConversa || verificaConversa == null){

        const conversaCriada = await conversa.create({
          user_remetente: idRemetente,
          user_destinatario: userDestinatario,

        })
        if(!conversaCriada){
          return res.status(400).json({msg:"Ocorreu um erro ao tentar iniciar esta conversa"})
        }
        let idNovaConversa = conversaCriada.id;

       // console.log( typeof idConversa) "number"

         const mensagemC = await Mensagem.create({
          content,
          conversa_id: idNovaConversa,
          id_usuario: idRemetente
          
        })
        if(!mensagemC){
          return res.status(400).json({
            msg: "Erro ao salvar a mensagem - nova conversa"
          })
        }

        return res.status(200).json({msg: "Conversa criada, mensagem salva"})

      }

      let idConversa = verificaConversa.id;

      const mensagemCriada = await Mensagem.create({
        content, 
        conversa_id: idConversa,

      });
      if(!mensagemCriada){
        return res.status(400).json({msg: "Erro ao salvar a mensagem"}) 
      }
     return res.status(200).json({msg: "Conversa criada, mensagem salva"})


    }catch(e){
      console.log(e)
    }

  }

}
export default new conversaCrontroller();