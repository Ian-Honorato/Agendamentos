import { Router } from "express";
import userController from "../controllers/UserController";
import loginRequired from "../middlewares/loginRequired";
import verificaUser from "../middlewares/verificaUser";

const router = new Router();

router.get("/", userController.index);
router.post("/", userController.store);
router.put("/:id", loginRequired, userController.update);
router.delete("/:id", loginRequired, verificaUser, userController.destroy);
router.get("/:id",loginRequired, userController.show);

export default router;
