import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createSchedule } from "../controllers/schedule.controller";

const router = Router();

// só usuário logado pode acessar
router.post("/", authMiddleware, createSchedule);

export default router;
