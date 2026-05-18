import { Router } from "express";
import {
    createUser,
    getUsers,
    handleRefresh,
    login,
} from "../controllers/auth.controller";
import { authorize } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/users", authMiddleware, authorize("admin"), getUsers);
router.post("/refresh", handleRefresh);
router.post("/register", authMiddleware, authorize("admin"), createUser);

export default router;
