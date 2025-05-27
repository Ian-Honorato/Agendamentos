import { Router } from "express";
import CategoriaController from "../controllers/CategoriaController";
 // midllewares
import loginRequired from "../middlewares/loginRequired";
import verificaUser from "../middlewares/verificaUser";

const router = new Router();

router.get("/", CategoriaController.index);
router.post("/",loginRequired, verificaUser, CategoriaController.store);
router.delete("/:id",loginRequired, verificaUser, CategoriaController.delete);
router.put("/:id", loginRequired, verificaUser, CategoriaController.update);

export default router;
