import { Router } from "express";
import {
    createProduct,
    getProductByUser,
} from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/isAdmin";

const router = Router();

// só usuário logado pode acessar
router.post("/", authMiddleware, authorize("admin", "employee"), createProduct);
router.get("/", authMiddleware, getProductByUser);

export default router;
