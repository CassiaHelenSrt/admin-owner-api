import { Router } from "express";
import {
    createClient,
    getClients,
    updateClient,
} from "../controllers/clientController";

import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/isAdmin";

const router = Router();

router.get("/", authMiddleware, authorize("admin"), getClients);
router.post("/", authMiddleware, authorize("admin"), createClient);
router.put("/:id", authMiddleware, authorize("admin"), updateClient);

export default router;
