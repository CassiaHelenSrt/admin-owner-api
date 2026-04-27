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

export const handleRefresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res
                .status(401)
                .json({ message: "Refresh Token é obrigatório." });
        }

        // Chama o service que criamos no passo anterior
        const result = await authService.refresh(refreshToken);

        res.json(result);
    } catch (error: any) {
        // Se o refresh token for inválido ou expirado, retorna 401 para o front deslogar o usuário
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
