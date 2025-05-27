import Categoria from "../models/Categoria";

class CategoriaController {
  async index(req, res) {

    try{
      const categoria = await Categoria.findAll();

      if(categoria.length === 0){
        return res.status(400).json({msg: "Nenhuma categoria cadastrada"});
      }

      return res.status(200).json(categoria)
    }catch(e){
      console.log(e)
    }

    return res
      .status(200)
      .json({ msg: "colocar as rotas para navegar na aplicação" });
  }
  async store(req, res){
    const {nome} = req.body;

    if(!nome || nome.length === 0){
      return res.status(400).json({msg: "Campo nome é obrigatório"})
    }
    try{
      const newCategoria = await Categoria.create({nome_categoria: nome});

      if(newCategoria.length === 0 ){
        return res.status(400).json({msg: "Erro ao cadastrar categoria"})
      }
      return res.status(200).json({msg: "Categoria cadastrada com sucesso", newCategoria})
    }catch(e){
      console.log(e)
    }
  }
  async delete(req, res){
    const {id} = req.params;

    if(!id){
      return res.status(400).json({msg: "Campo id é obrigatório"})
    }

    try{
      const categoria = await Categoria.destroy({where: {id}});

      if(categoria.length === 0){
        return res.status(400).json({msg: "Erro ao deletar categoria"})
      }
      return res.status(200).json({msg: "Categoria deletada com sucesso", categoria})
    }catch(e){
      console.log(e)
    }
  }
  async update(req, res){
    const {id} = req.params;
    const {nome} = req.body;
    if(!id || !nome){
      return res.status(400).json({msg: "Campos obrigatórios"})
    }
    try{
      const updateCategoria  = await Categoria.update({
        nome_categoria: nome
      },{
        where: {id_categoria:id}
      });

      if(updateCategoria.length === 0){
        return res.status(400).json({msg: "Erro ao atualizar categoria"})
      }
      return res.status(200).json({msg: "Categoria atualizada com sucesso", updateCategoria})
    }catch(e){
      console.log(e)
    }
  }
}
export default new CategoriaController();
