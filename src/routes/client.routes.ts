import { Router } from "express";
import { createUploadMiddleware } from "../config/multer";

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

const uploadClientPhoto = createUploadMiddleware("clients");

router.get("/all", authMiddleware, authorize("admin"), getAllClients);
router.get("/", authMiddleware, getClientsByUser);
router.get("/:id", authMiddleware, getClientDetails);
router.post(
    "/",
    uploadClientPhoto,
    authMiddleware,
    authorize("admin", "employee"),
    createClient,
);
router.put(
    "/:id",
    authMiddleware,
    authorize("admin", "employee"),
    updateClient,
);
router.delete(
    "/:id",
    authMiddleware,
    authorize("admin", "employee"),
    deleteClient,
);

export default router;
