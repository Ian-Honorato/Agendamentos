import { Router } from "express";
import trocaController from "../controllers/TrocaController";
import loginRequired from "../middlewares/loginRequired";


const router = new Router();

router.get("/",loginRequired, trocaController.index);
router.post("/", loginRequired, trocaController.store);
router.put("/:id_troca", loginRequired, trocaController.updateState);
router.get("/:id_troca", loginRequired, trocaController.findById);
router.get("/", loginRequired, trocaController.findAll);

export default router;
