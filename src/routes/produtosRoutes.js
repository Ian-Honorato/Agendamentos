import { Router } from "express";
import produtoController from "../controllers/ProdutoController";


//middlewares
import loginRequired from "../middlewares/loginRequired";
import isUser from "../middlewares/isUser";
//multer
import multer from "multer";
import path from "path";
import multerConfig from "../config/multer";

const upload = multer(multerConfig);

const router = new Router();

router.get("/",loginRequired, produtoController.index);
router.post("/",loginRequired, upload.single("imagem_produto"), produtoController.store);
router.delete("/:id_produto",loginRequired, isUser, produtoController.delete);
export default router;
