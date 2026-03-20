import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

const authService = new AuthService();

export const login = (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const result = authService.login(username, password);

        res.json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};
