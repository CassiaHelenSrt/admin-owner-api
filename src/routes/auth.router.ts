import { Router } from "express";
import { createUser, login } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.post("/users", createUser);

export default router;
