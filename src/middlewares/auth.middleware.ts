import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../types/AuthTokenPayload";

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
        const decoded = jwt.verify(token, SECRET_KEY!) as AuthTokenPayload;

        req.user = decoded;

        return next();
    } catch {
        return res.status(401).json({ message: "Token inválido" });
    }
};
