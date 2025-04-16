import { Router } from "express";
import userController from "../controllers/UserController";
import loginRequired from "../middlewares/loginRequired";
const router = new Router();

router.get("/", userController.index);
router.post("/", userController.store);
router.put("/:id", loginRequired, userController.update);
router.delete("/:id", userController.destroy);
router.get("/:id", userController.show);

export default router;
