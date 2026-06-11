import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { UserRole } from "../entities/User";

import * as fs from "fs";
import * as path from "path";

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response) => {
    try {
        // 1. Remove os espaços fantasmas das chaves do body enviado
        const bodySanitizado: any = {};
        for (const key in req.body) {
            bodySanitizado[key.trim()] = req.body[key];
        }

        const { name, type, price, duration, description } = bodySanitizado;
        const userId = req.user?.id;

        // Monta o objeto base com os textos recebidos
        const productData: any = { name, type, price, duration, description };

        // 2. SE o Multer interceptou a foto do produto, adiciona o caminho
        if (req.file) {
            productData.photo = `uploads/products/${req.file.filename}`;
        }

        // 3. Tenta salvar no banco de dados
        const product = await productService.createProduct(
            productData,
            userId!,
        );
        res.status(201).json(product);
    } catch (error: any) {
        //REDE DE SEGURANÇA: Se deu erro (ex: validação falhou), apaga a foto nova da pasta
        if (req.file) {
            const caminhoNovaFoto = path.resolve(
                __dirname,
                `../../uploads/products/${req.file.filename}`,
            );
            if (fs.existsSync(caminhoNovaFoto)) {
                fs.unlinkSync(caminhoNovaFoto);
            }
        }
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
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role as UserRole;

        // 1. Remove os espaços fantasmas das chaves do body enviado
        const bodySanitizado: any = {};
        for (const key in req.body) {
            bodySanitizado[key.trim()] = req.body[key];
        }
        const { name, type, price, duration, description } = bodySanitizado;

        const updateData: any = { name, type, price, duration, description };

        // Se o usuário mandou uma foto nova, coloca o caminho dela nos dados
        if (req.file) {
            updateData.photo = `uploads/products/${req.file.filename}`;
        }

        // Envia tudo direto para o Service resolver
        const updatedProduct = await productService.updateProduct(
            Number(id),
            userId!,
            updateData,
            userRole,
        );

        res.json(updatedProduct);
    } catch (error: any) {
        // REDE DE SEGURANÇA: Se deu erro na atualização, joga fora a foto nova que o Multer criou
        if (req.file) {
            const NewPhotoPath = path.resolve(
                __dirname,
                `../../uploads/products/${req.file.filename}`,
            );
            if (fs.existsSync(NewPhotoPath)) {
                fs.unlinkSync(NewPhotoPath);
            }
        }
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
