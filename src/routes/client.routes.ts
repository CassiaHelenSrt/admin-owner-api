import { Router } from "express";
import {
    createClient,
    deleteClient,
    getAllClients,
    getClientDetails,
    getClientsByUser,
    updateClient,
} from "../controllers/clientController";

import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/isAdmin";

const router = Router();

router.get("/all", authMiddleware, authorize("admin"), getAllClients);
router.get("/", authMiddleware, getClientsByUser);
router.get("/:id", authMiddleware, getClientDetails);
router.post("/", authMiddleware, authorize("admin"), createClient);
router.put("/:id", authMiddleware, authorize("admin"), updateClient);
router.delete("/:id", authMiddleware, authorize("admin"), deleteClient);

export default router;
