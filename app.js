import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./src/database";

import tokenRoutes from "./src/routes/tokenRoutes";
import homeRoutes from "./src/routes/homeRoutes";
import userRoutes from "./src/routes/userRoutes";
import contatoRoutes from "./src/routes/contatoRoutes";
class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  routes() {
    this.app.use("/", homeRoutes);
    this.app.use("/users", userRoutes);
    this.app.use("/token", tokenRoutes);
    this.app.use("/contato", contatoRoutes);
  }
}
export default new App().app;
