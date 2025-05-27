import { Sequelize } from "sequelize";
import database from "../config/database";

import User from "./User";
import Contato from "./Contato";
import Conversa from "./Conversa";
import Mensagem from "./Mensagem";
import Carteira from "./Carteira";
import Categoria from "./Categoria";
import Produto from  "./Produto";
import Troca from "./Troca";
import ProdutoNaTroca from "./ProdutosNaTroca";

const models = [User, Contato, Conversa, Mensagem, Carteira, Categoria, Produto, Troca, ProdutoNaTroca]; ;

const connection = new Sequelize(database);

models.forEach((model) => model.init(connection));

models.forEach(
  (model) => model.associate && model.associate(connection.models)
);

export { connection, User, Contato, Conversa, Mensagem, Carteira, Categoria, Produto, Troca, ProdutoNaTroca};
