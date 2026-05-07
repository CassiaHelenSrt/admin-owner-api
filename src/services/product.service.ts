import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";
import { User, UserRole } from "../entities/User";

export class ProductService {
    private productRepo = AppDataSource.getRepository(Product);
    private userRepo = AppDataSource.getRepository(User);

    async createProduct(data: any, userId: number) {
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

    async updateProduct(
        productId: number,
        userId: number,
        data: any,
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

        // Segurança
        delete data.id;
        delete data.user;
        delete data.userId;

        // Atualiza os dados
        this.productRepo.merge(product, data);

        return await this.productRepo.save(product);
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

        // Remove do banco
        return await this.productRepo.remove(product);
    }
}
