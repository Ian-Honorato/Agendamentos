import { Router } from "express";
import carteiraController from "../controllers/CarteiraController";

import loginRequired from "../middlewares/loginRequired";
import isUser from "../middlewares/isUser";
import verificaUser from "../middlewares/verificaUser";

const router = new Router();

router.get("/", carteiraController.show);
router.put("/", carteiraController.update);

export default router;
