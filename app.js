import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./src/config/database.js"

import tokenRoutes from "./src/routes/tokenRoutes";
import homeRoutes from "./src/routes/homeRoutes";
import userRoutes from "./src/routes/userRoutes";
import contatoRoutes from "./src/routes/contatoRoutes";
import conversaRoutes from "./src/routes/conversaRoutes"
import mensagensRoutes from "./src/routes/mensagensRoutes";
import carteiraRoutes from "./src/routes/carteiraRoutes";
import categoriaRoutes from "./src/routes/categoriaRoutes";
import produtoRoutes from "./src/routes/produtosRoutes";
import trocaRoutes from "./src/routes/trocaRoutes";
import path from "path";

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use("/images", express.static(path.resolve(__dirname, "upload", "images")));

  }
  routes() {
    this.app.use("/", homeRoutes);
    this.app.use("/users", userRoutes);
    this.app.use("/token", tokenRoutes);
    this.app.use("/contato", contatoRoutes);
    this.app.use("/conversa", conversaRoutes);
    this.app.use("/mensagem", mensagensRoutes);
    this.app.use("/carteira", carteiraRoutes);
    this.app.use("/categoria", categoriaRoutes);
    this.app.use("/produto", produtoRoutes);
    this.app.use("/troca", trocaRoutes);
  }
}
export default new App().app;
  