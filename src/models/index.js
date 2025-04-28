import { Sequelize } from "sequelize";
import database from "../config/database";

import User from "./User";
import Contato from "./Contato";

const models = [User, Contato];

const connection = new Sequelize(database);

models.forEach((model) => model.init(connection));

models.forEach(
  (model) => model.associate && model.associate(connection.models)
);

export { connection, User, Contato };
