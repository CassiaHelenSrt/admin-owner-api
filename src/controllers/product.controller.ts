import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { UserRole } from "../entities/User";

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, type, price, duration, description } = req.body;

        const userId = req.user?.id;

        const product = await productService.createProduct(
            { name, type, price, duration, description },
            userId!,
        );

        res.status(201).json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getProductByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role as UserRole;

        if (!userId) {
            return res
                .status(401)
                .json({ message: "Usuário não autenticado." });
        }

        const product = await productService.getProductByUser(userId, userRole);

        res.json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
