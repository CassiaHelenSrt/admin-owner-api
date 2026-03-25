import { Router } from "express";
import { createClient } from "../controllers/clientController";

import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// só usuário logado pode acessar

router.post("/", authMiddleware, createClient);
// router.get("/", authMiddleware, getClients);

export default router;
