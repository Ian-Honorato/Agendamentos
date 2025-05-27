import { Router } from "express";
import conversaController from "../controllers/ConversaController";
import loginRequired from "../middlewares/loginRequired";

const router = new Router();

router.get("/", loginRequired, conversaController.showAll); // mostar as conversas do usuario logado
router.post("/", loginRequired, conversaController.store); // criar as conversas
export default router;
