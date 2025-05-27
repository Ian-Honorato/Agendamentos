import Troca from "../models/Troca";
import Produto from "../models/Produto";
import { Carteira } from "../models";
import {ProdutoNaTroca} from "../models";


class TrocaController {
  async index(req, res) {
    return res
      .status(200)
      .json({ msg: "colocar as rotas para navegar na aplicação" });
  }

  async store(req, res){
    const id_usuario_logado = req.userId;
    //deposi verificar se virá um objeto com os produtos, ou será enviado individualmente.

    const {usuario_solicitado, produto_solicitado, quantidade} = req.body

    //verifica se os dados necessários vieram na requisição

    if(!usuario_solicitado || !produto_solicitado ||!quantidade){
      return res.status(400).json({msg: "Todos os campos devem ser preenchidos"});
    }
    //verifica se o usuario nao esta solicitando para ele mesmo
    if(usuario_solicitado == id_usuario_logado){
      return res.status(400).json({msg: "Nao pode trocar com o proprio usuario"});
    }
    //quantidade pretendida maior que 0
    if(quantidade <= 0 ){
        return res.status(400).json({msg:"A quantidade requerida nao pode ser 0 ou inferior a 0"})
    }
    
    try{ 
        //localizar o produto solicitado
        const produto = await Produto.findByPk(produto_solicitado);

        if(!produto || produto.length == 0){
          return res.status(400).json({msg: "Produto não encontrado"});
        }
        //usuario nao poder fazer requisição para produtos cadastrados por ele mesmo
        if(id_usuario_logado == produto.user_id){
        return res.status(400).json({msg: "Nao pode trocar com o proprio usuario"});
        }
        //verifica se o produto tem estoque
        if(produto.quantidade <= 0){
        return res.status(400).json({msg: "Produto sem estoque"});
        }
        //verifica estoque por quantidade requerida
        if(produto.quantidade < quantidade){
        return res.status(400).json({msg: "Produto sem estoque suficiente"});
        }
        //verificar se o valor da troca nao ultrapassa o saldo da carteira
        const verificaCredito = await Carteira.findOne({where: {user_id: id_usuario_logado}});

        if(!verificaCredito || verificaCredito.length == 0){
            return res.status(400).json({msg: "Carteira nao encontrada"});
        }
        const valorTotal = produto.preco_produto * quantidade;

        console.log(valorTotal)
        if(verificaCredito.moedas < valorTotal){
            return res.status(400).json({msg: "Saldo insuficiente"});
        }

        const troca = await Troca.create({
            state: 'pendente',
            usuario_solicitante_id: id_usuario_logado,
            usuario_solicitado_id: usuario_solicitado,
            valor_total: valorTotal,
        })
        
        if(!troca || troca.length == 0){
          return res.status(400).json({msg: "Erro ao criar a troca"});
        }

        const produtoTroca = await ProdutoNaTroca.create({
            nome_snapshot: produto.nome_produto,
            preco_snapshot: produto.preco_produto,
            quantidade: quantidade,
            id_produto: produto.id_produto,
            id_troca: troca.id_troca,
        })

        if(!produtoTroca || produtoTroca.length == 0){
          return res.status(400).json({msg: "Erro ao criar o produto na troca"});
        } 
        //atualiza o estoque do produto e carteira dos usuarios

        const atualizaEstoque = await Produto.update(
          {quantidade: produto.quantidade - quantidade},
           {where: {id_produto: produto.id_produto}}
           );

        if(!atualizaEstoque || atualizaEstoque.length == 0){
            return res.status(400).json({msg: "Erro ao atualizar o estoque"});
        }
       
        return res.status(200).json({msg: "Troca feita com sucesso - status pedido pendente"});
   
}catch(e){
    console.log(e)
}

  }
  async updateState(req, res) {

    const {id_troca} = req.params;
    const {state} = req.body;
    const id_usuario_logado = req.userId

    if(!state || !id_troca){
      return res.status(400).json({msg: "preencha todos os campos"})
    }
    try{

      //verifica se o id da troca existe
      const verificaTroca = await Troca.findByPk(id_troca);

      if(id_usuario_logado != verificaTroca.usuario_solicitado_id){
        return res.status(400).json({msg: "Nao pode alterar a troca de outro usuario"});
      }

      if(!verificaTroca){
        return res.status(400).json({msg: "Troca nao encontrada"});
      }
      //verifica se o estado da troca é valido
       const estadosValidos = ["aceita", "pendente", "recusada", "finalizada"];
      if (!estadosValidos.includes(state)) {
        return res.status(400).json({ msg: "Estado não válido" });
      }

      //troca recusa 
      //atualiza o estoque do produto e carteira dos usuarios
      if (state === "recusada") {
        const produtosNaTroca = await ProdutoNaTroca.findAll({ where: { id_troca } });
      
        if (!produtosNaTroca || produtosNaTroca.length === 0) {
          return res.status(400).json({ msg: "Produtos não encontrados" });
        }
        // a principio nao é necessario "for" pois só é possivel 1 produto por troca
        for (let i = 0; i < produtosNaTroca.length; i++) {
          const itemTroca = produtosNaTroca[i];
          const produto = await Produto.findByPk(itemTroca.id_produto);
      
          if (!produto) {
            return res.status(400).json({ msg: "Produto não encontrado" });
          }
      
          const novaQuantidade = produto.quantidade + itemTroca.quantidade;
      
          const atualizaEstoque = await Produto.update(
            { quantidade: novaQuantidade },
            { where: { id_produto: produto.id_produto } }
          );
      
          if (!atualizaEstoque || atualizaEstoque[0] === 0) {
            return res.status(400).json({ msg: "Erro ao atualizar o estoque" });
          }
        }
      
        const atualizaStatus = await Troca.update({ state: "recusada" }, { where: { id_troca } });
      
        if (!atualizaStatus || atualizaStatus[0] === 0) {
          return res.status(400).json({ msg: "Erro ao atualizar o status da troca" });
        }
      
        return res.status(200).json({ msg: "Troca recusada com sucesso" });
      }
      

      //troca aceita
       if(state === "aceita"){
        
        const valorTotal = verificaTroca.valor_total;

        const id_usuario_solicitante = verificaTroca.usuario_solicitante_id;
        const id_usuario_solicitado = verificaTroca.usuario_solicitado_id;

        
        const verificaCarteiraSolicitante = await Carteira.findByPk(id_usuario_solicitante);
        const verificaCarteiraSolicitado = await Carteira.findByPk(id_usuario_solicitado);
        

        if(!verificaCarteiraSolicitante || verificaCarteiraSolicitante.length == 0){
          return res.status(400).json({msg: "Carteira do solicitante nao encontrada"});
        }
        if(!verificaCarteiraSolicitado || verificaCarteiraSolicitado.length == 0){
          return res.status(400).json({msg: "Carteira do solicitado nao encontrada"});
        }

        const atualizaCarteiraSolicitante = await Carteira.update(
          {moedas: verificaCarteiraSolicitante.moedas + valorTotal},
          {where: {user_id: id_usuario_solicitante}}
          );
        const atualizaCarteiraSolicitado = await Carteira.update(
          {moedas: verificaCarteiraSolicitado.moedas - valorTotal},
          {where: {user_id: id_usuario_solicitado}}
          );

        if(!atualizaCarteiraSolicitante || atualizaCarteiraSolicitante.length == 0){
          return res.status(400).json({msg: "Erro ao atualizar a carteira do solicitante"});
        }
        if(!atualizaCarteiraSolicitado || atualizaCarteiraSolicitado.length == 0){
          return res.status(400).json({msg: "Erro ao atualizar a carteira do solicitado"});
        }
        const atualizaStatus = await Troca.update({state: 'aceita'}, {where: {id_troca: id_troca}});

        if(!atualizaStatus || atualizaStatus.length == 0){
          return res.status(400).json({msg: "Erro ao atualizar o status da troca"});
        }

        return res.status(200).json({msg: "Troca aceita com sucesso"});

      }
      //troca finalizada
      
      if(state === 'finalizada' ){

        const atualizaStatus = await Troca.update({state: 'finalizada'}, {where: {id_troca: id_troca}});

        if(!atualizaStatus || atualizaStatus.length == 0){
          return res.status(400).json({msg: "Erro ao atualizar o status da troca"}); 
        }
        return res.status(200).json({msg: "Troca finalizada com sucesso"}); 
      }

      return res.status(200).json({msg: "Troca atualizada com sucesso"});
    }catch(e){
      console.log(e)
    }
  }
  async findAll(req, res){
    const id_usuario = req.userId;
    
    
    if(!id_usuario){
      return res.status(400).json({msg: "id do usuario nao informado"});
    }
    try{
      const trocas = await Troca.findOne(
        {
          where: {
            [Op.or]: [
              { usuario_solicitado_id: id_usuario },
              { usuario_solicitante_id: id_usuario }
            ]
          },
          include: [{model: ProdutoNaTroca}]
        }
      );

      if(id_usuario != trocas.usuario_solicitado_id && id_usuario != trocas.usuario_solicitante_id){
        return res.status(400).json({msg: "Nao possui trocas"});
      }

      return res.status(200).json(trocas);
    }catch(e){
      console.log(e)
    } 
  }
  async findById(req, res){
   const id_usuario = req.userId;
   
    const {id_troca} = req.params;

    if(!id_troca){
      return res.status(400).json({msg: "id da troca nao informado"})
    }
    try{
      const troca = await Troca.findOne(
        {where: {id_troca: id_troca}},
        {include: [{model: ProdutoNaTroca}]}
      );
      
      if(!troca){
        return res.status(400).json({msg: "Troca nao encontrada"})
      }

      if(id_usuario != troca.usuario_solicitado_id && id_usuario != troca.usuario_solicitante_id){
        return res.status(400).json({msg: "Nao possui essa troca"});
      }
      return res.status(200).json(troca);
    }catch(e){
      console.log(e)
    }
  }
}
export default new TrocaController();
