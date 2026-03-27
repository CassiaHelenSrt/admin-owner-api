import { Router } from "express";
import { createUser, login } from "../controllers/auth.controller";
import { authorize } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", authMiddleware, authorize("admin"), createUser);

export default router;
