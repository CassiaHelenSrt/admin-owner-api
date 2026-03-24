import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

const SECRET_KEY = "3fa38e665f28951d5f4e4706770cf0465f0c901a";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("HEADER:", req.headers.authorization);
    console.log("TOKEN:", token);
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as {
            id: number;
            role: string;
        };

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
