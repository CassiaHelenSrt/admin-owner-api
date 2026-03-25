import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

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
