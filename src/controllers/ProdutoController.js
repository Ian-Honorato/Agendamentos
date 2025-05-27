import Produto from "../models/Produto";
import { ProdutoNaTroca } from "../models";

class ProdutoController {
  async index(req, res) {
    return res
      .status(200)
      .json({ msg: "colocar as rotas para navegar na aplicação" });
  }
  async store(req, res){
    //id_usuario logado
    const user_id = req.userId;
    //dados necessarios para o cadastro
    const { nome_produto, estoque_produto, preco_produto, descricao_produto, categoria_produto} = req.body;
    
    const {filename} = req.file;
    console.log(req.body, filename, user_id);
   

    if(!nome_produto || !preco_produto || !descricao_produto || !categoria_produto || !filename || !estoque_produto){
      return res.status(400).json({msg: "Todos os campos devem ser preenchidos"});
    }

    const produto = await Produto.create({
        nome_produto,
        estoque_produto,
        preco_produto,
        descricao_produto,
        categoria_produto, 
        imagem_produto: filename,
        user_id
        });
    //verifica se o produto foi criado
    if(!produto){
      return res.status(400).json({msg: "O produto nao foi criado"});
    }
    return res.status(200).json({msg: "Produto criado com sucesso", produto});
  }
  async delete(req, res){
    const {id_produto} = req.params;

    const produtoTroca = await ProdutoNaTroca.findAll({where: {id_produto}});

    if(produtoTroca.length > 0){
      return res.status(400).json({msg: "Produto nao pode ser deletado"});
    }

    const produto = await Produto.findByPk(id_produto);
    if(!produto || produto.length == 0){
      return res.status(400).json({msg: "Produto nao encontrado"});
    }
    const destroyProduto =await produto.destroy();
    if(!destroyProduto || destroyProduto.length == 0){
      return res.status(400).json({msg: "O produto nao foi deletado"});
    }
    return res.status(200).json({msg: "Produto deletado com sucesso"});
  }
  
}
export default new ProdutoController();
