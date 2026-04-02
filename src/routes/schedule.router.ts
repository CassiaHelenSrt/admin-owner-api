import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createSchedule } from "../controllers/schedule.controller";
import { authorize } from "../middlewares/isAdmin";

const router = Router();

// só usuário logado pode acessar
// router.post(
//     "/",
//     authMiddleware,
//     authorize("admin", "employee"),
//     createSchedule,
// );
router.post("/", authMiddleware, createSchedule);
export default router;
