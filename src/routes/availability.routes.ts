import { Router } from "express";
import {
    createAvailability,
    getAvailability,
    getAvailableSlots,
} from "../controllers/availability.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// criar disponibilidade
router.post("/", authMiddleware, createAvailability);

//horários disponíveis (por data)
router.get("/available/slots", authMiddleware, getAvailableSlots);

// buscar disponibilidades do usuário
router.get("/:userId", authMiddleware, getAvailability);

export default router;
