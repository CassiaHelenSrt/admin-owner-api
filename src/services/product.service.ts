import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";
import { User, UserRole } from "../entities/User";
import { CreateProductDTO, UpdateProductDTO } from "../types/CreateProductDTO";

import * as fs from "fs";
import * as path from "path";

export class ProductService {
    private productRepo = AppDataSource.getRepository(Product);
    private userRepo = AppDataSource.getRepository(User);

    async createProduct(data: CreateProductDTO, userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const product = this.productRepo.create({
            ...data,
            user,
        });

        return this.productRepo.save(product);
    }

    async getProductByUser(userId: number, userRole: UserRole) {
        const isAdmin = userRole === UserRole.ADMIN;

        return this.productRepo.find({
            where: isAdmin ? {} : { user: { id: userId } },
        });
    }

    async getProductById(
        productId: number,
        userId: number,
        userRole: UserRole,
    ) {
        const isAdmin = userRole === UserRole.ADMIN;

        const whereCondition = isAdmin
            ? { id: productId }
            : { id: productId, user: { id: userId } };

        const product = await this.productRepo.findOne({
            where: whereCondition,
        });

        if (!product) {
            throw new Error(
                "Produto não encontrado ou você não tem permissão.",
            );
        }

        return product;
    }

    async updateProduct(
        productId: number,
        userId: number,
        data: UpdateProductDTO,
        userRole: UserRole,
    ) {
        // Admin vê tudo | Employee só os dele
        const whereCondition =
            userRole === UserRole.ADMIN
                ? { id: productId }
                : { id: productId, user: { id: userId } };

        const product = await this.productRepo.findOne({
            where: whereCondition,
        });

        if (!product) {
            throw new Error(
                "Produto não encontrado ou sem permissão para editar.",
            );
        }

        // Exemplo: validar nome duplicado
        if (data.name) {
            const name = data.name.trim();

            const productExists = await this.productRepo.findOne({
                where: {
                    name,
                    user: { id: userId },
                },
            });

            if (productExists && productExists.id !== productId) {
                throw new Error("Já existe outro produto com esse nome.");
            }

            data.name = name;
        }

        //NOVO: REGRA DA FOTO ANTIGA
        // Se o controller enviou uma foto nova, guardamos o caminho da antiga para limpar depois

        let fotoAntigaParaDeletar: string | null = null;
        if (data.photo && product.photo) {
            fotoAntigaParaDeletar = product.photo;
        }

        // Atualiza os dados
        this.productRepo.merge(product, data);

        // Salva no banco de dados de verdade
        const productSaved = await this.productRepo.save(product);

        if (fotoAntigaParaDeletar) {
            const caminhoFotoVelha = path.resolve(
                __dirname,
                `../../${fotoAntigaParaDeletar}`,
            );
            if (fs.existsSync(caminhoFotoVelha)) {
                fs.unlinkSync(caminhoFotoVelha);
            }
        }

        return productSaved;
    }

    async deleteProduct(productId: number, userId: number, userRole: UserRole) {
        // Admin vê tudo | Employee só os dele
        const whereCondition =
            userRole === UserRole.ADMIN
                ? { id: productId }
                : { id: productId, user: { id: userId } };

        // Busca o produto
        const product = await this.productRepo.findOne({
            where: whereCondition,
            relations: ["schedules"],
        });

        if (!product) {
            throw new Error(
                "Produto não encontrado ou você não tem permissão para excluí-lo.",
            );
        }

        // Verifica vínculos
        if (product.schedules && product.schedules.length > 0) {
            throw new Error(
                "Este produto possui agendamentos vinculados e não pode ser excluído.",
            );
        }

        // Se o produto tiver uma foto registrada, vai até a pasta e apaga o arquivo do computador
        if (product.photo) {
            const filePath = path.resolve(__dirname, `../../${product.photo}`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Remove o arquivo físico
            }
        }

        // Remove do banco
        return await this.productRepo.remove(product);
    }
}
