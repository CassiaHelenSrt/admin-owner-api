import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
        return res.status(401).json({ message: "Token mal formatado" });
    }

    const [scheme, token] = parts;

    if (scheme !== "Bearer") {
        return res.status(401).json({ message: "Token mal formatado" });
    }

    try {
        const decoded: any = jwt.verify(token, SECRET_KEY!) as {
            id: number;
            role: string;
        };

        const agora = Math.floor(Date.now() / 1000);
        const expiracao = decoded.exp; // Corrigido para .exp

        console.log(
            `Agora: ${agora} | Expira em: ${expiracao} | Faltam: ${expiracao - agora}s`,
        );
        req.user = decoded;

        return next();
    } catch (error: any) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
