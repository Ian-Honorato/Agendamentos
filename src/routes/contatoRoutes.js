import { Router } from "express";
import contatoController from "../controllers/ContatoController";
import loginRequired from "../middlewares/loginRequired";
import isUser from "../middlewares/isUser";
import verificaUser from "../middlewares/verificaUser";

const router = new Router();

router.get("/", loginRequired, verificaUser, contatoController.show);
router.post("/:id", loginRequired, isUser, contatoController.store);
router.put("/:id", loginRequired, isUser, contatoController.update);
router.delete("/:id", loginRequired, isUser, contatoController.destroy);
export default router;
