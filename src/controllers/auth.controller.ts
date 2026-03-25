import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const result = await authService.login(username, password);
        console.log(result);

        return res.json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const user = await authService.createUser(name, email, password);

        return res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
