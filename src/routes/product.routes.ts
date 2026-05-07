import { Router } from "express";
import {
    createProduct,
    getProductByUser,
    updateProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/isAdmin";

const router = Router();

// só usuário logado pode acessar
router.post("/", authMiddleware, authorize("admin", "employee"), createProduct);
router.get("/", authMiddleware, getProductByUser);
router.put(
    "/:id",
    authMiddleware,
    authorize("admin", "employee"),
    updateProduct,
);

export default router;
