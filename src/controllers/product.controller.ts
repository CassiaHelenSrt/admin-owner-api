import { Request, Response } from "express";

export const createProduct = (req: Request, res: Response) => {
    return res.status(201).json("cadastrou protudo");
};
