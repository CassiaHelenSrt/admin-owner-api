import { Router } from "express";
import {
    createUser,
    handleRefresh,
    login,
} from "../controllers/auth.controller";
import { authorize } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/refresh", handleRefresh);
router.post("/register", authMiddleware, authorize("admin"), createUser);

export default router;
