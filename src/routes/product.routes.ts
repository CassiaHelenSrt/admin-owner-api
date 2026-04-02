import { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/isAdmin";

const router = Router();

// só usuário logado pode acessar
router.post("/", authMiddleware, authorize("admin"), createProduct);

export default router;
