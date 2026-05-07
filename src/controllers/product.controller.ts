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

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // O ID do cliente vem da URL: /clients/:id
        const { name, type, price, duration, description } = req.body;
        const userId = req.user?.id;
        const userRole = req.user?.role as UserRole; // Captura o cargo do usuário

        const updateProduct = await productService.updateProduct(
            Number(id),
            userId!,
            { name, type, price, duration, description },
            userRole,
        );

        res.json(updateProduct);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Pegando o ID de quem está logado
        const userRole = req.user?.role as UserRole; // Captura o cargo do usuário

        // Passamos os dois IDs para o service conferir
        await productService.deleteProduct(Number(id), userId!, userRole);

        res.status(204).send();
    } catch (error: any) {
        // Corrigido para .message
        res.status(400).json({ message: error.message });
    }
};
