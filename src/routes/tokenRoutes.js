import { Router } from "express";
import token from "../controllers/TokenController";
const router = new Router();

router.get("/", token.store);
export default router;
