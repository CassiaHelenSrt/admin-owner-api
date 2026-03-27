import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);
        console.log(result);

        return res.json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        // if (req.user?.role !== "admin") {
        //     return res.status(403).json({
        //         message: "Apenas administradores podem criar usuário",
        //     });
        // }
        const { name, email, password } = req.body;

        const user = await authService.createUser(name, email, password);

        return res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
