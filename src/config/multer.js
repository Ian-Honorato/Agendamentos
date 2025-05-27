import multer from "multer";
import { resolve, extname } from "path";

// Função para gerar número aleatório
const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return cb(new multer.MulterError("somente PNG ou JPEG"));
    }
    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname, "..", "..", "uploads", "produtos", "images"));
    },
    filename: (req, file, cb) => {
      const ext = extname(file.originalname);
      cb(null, `${Date.now()}_${aleatorio()}${ext}`);
    },
  }),
};