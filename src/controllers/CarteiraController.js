import Carteira from "../models/Carteira";

// import User from "../models/User";

class CarteiraController {
  async update(req, res) {
    const {id_usuario, moedas, operacao} = req.body;

    if(!id_usuario || !moedas || !operacao){
      return res.status(400).json({msg: "preencha todos os campos"});
    }
    const carteira = await Carteira.findOne({
      where:{
        user_id: id_usuario
      },

    });
    if(!carteira){
      return res.status(400).json({msg: "carteira não encontrada"});
    }
    if(operacao === "increment"){

      const novoSaldo = parseFloat(carteira.moedas) + parseFloat(moedas);

     let attSaldo =  await carteira.update({moedas: novoSaldo});

     if(!attSaldo){
      return res.status(400).json({msg: "erro ao atualizar carteira"});
     }
    
      return res.status(200).json({ msg: "Carteira atualizada com sucesso", saldo: novoSaldo });

    }else if(operacao === "decrement"){
      
      const valorAtual = parseFloat(carteira.moedas)

      const desconto = parseFloat(moedas);

      if(desconto > valorAtual){
        return res.status(400).json({msg: "valor maior que o saldo"});
      }
      const novoSaldo = valorAtual - desconto;

      let attSaldo = await carteira.update({moedas: novoSaldo});

      if(!attSaldo){
        return res.status(400).json({msg: "erro ao atualizar carteira"});
       }

      return res.status(200).json({ msg: "Carteira atualizada com sucesso", saldo: novoSaldo });

    }else{
      res.status(400).json({msg: "operacao inválida"});
    }
  }
  async show(req, res){
    const {id_usuario} = req.params;
    if(!id_usuario){
      return res.status(400).json({msg: "preencha todos os campos"});
    }
    const carteira = await Carteira.findOne({
      where:{
        user_id: id_usuario
      },

    });
    if(!carteira){
      return res.status(400).json({msg: "carteira não encontrada"});
    }
    return res.status(200).json(carteira);
  }
}
export default new CarteiraController();
