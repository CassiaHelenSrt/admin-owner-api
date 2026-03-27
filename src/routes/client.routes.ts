import { Router } from "express";
import { createClient } from "../controllers/clientController";

import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/isAdmin";

const router = Router();

// só usuário logado pode acessar

router.post("/", authMiddleware, authorize("admin"), createClient);
// router.get("/", authMiddleware, getClients);

export default router;
