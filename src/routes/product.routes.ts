import { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// só usuário logado pode acessar
router.post("/", authMiddleware, createProduct);

export default router;
