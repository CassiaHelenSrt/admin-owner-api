import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(" ")[1];

    // console.log("HEADER:", req.headers.authorization);
    // console.log("TOKEN:", token);

    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY as string) as {
            id: number;
            role: string;
        };

        req.user = decoded; //id

        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
