import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProductByUser,
    updateProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/isAdmin";
import { createUploadMiddleware } from "../config/multer";

const uploadProductPhoto = createUploadMiddleware("products");

const router = Router();

// só usuário logado pode acessar
router.post(
    "/",
    uploadProductPhoto,
    authMiddleware,
    authorize("admin", "employee"),
    createProduct,
);
router.get("/", authMiddleware, getProductByUser);
router.put(
    "/:id",
    uploadProductPhoto,
    authMiddleware,
    authorize("admin", "employee"),
    updateProduct,
);

router.delete(
    "/:id",
    authMiddleware,
    authorize("admin", "employee"),
    deleteProduct,
);

export default router;
