import { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// só usuário logado pode acessar
router.get("/", authMiddleware, createProduct);

export default router;
