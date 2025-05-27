import { Router } from "express";
import mensagemController from "../controllers/MensagemController";
import loginRequired from "../middlewares/loginRequired";
const router = new Router();

router.post("/",loginRequired, mensagemController.store);
router.get("/:id_conversa", mensagemController.findAll);
router.put("/:id_mensagem", loginRequired, mensagemController.updateState);

export default router;
