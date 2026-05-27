import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUsers,
    handleRefresh,
    login,
    updateEmployee,
} from "../controllers/auth.controller";
import { authorize } from "../middlewares/isAdmin";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/users", authMiddleware, authorize("admin"), getUsers);
// users sao funcionarios nesse sentido
router.put(
    "/employees/:id",
    authMiddleware,
    authorize("admin"),
    updateEmployee,
);
router.delete("/user/:id", authMiddleware, authorize("admin"), deleteUser);
router.post("/refresh", handleRefresh);
router.post("/register", authMiddleware, authorize("admin"), createUser);

export default router;
