import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
    createSchedule,
    getDailySchedules,
    getMonthlySchedules,
} from "../controllers/schedule.controller";

const router = Router();

// só usuário logado pode acessar
// router.post(
//     "/",
//     authMiddleware,
//     authorize("admin", "employee"),
//     createSchedule,
// );
router.post("/", authMiddleware, createSchedule);
router.get("/day", authMiddleware, getDailySchedules); // get por dia da semana
router.get("/month", authMiddleware, getMonthlySchedules); // todos os agendamentos do mes
export default router;
