import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";
import { User } from "../entities/User";

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
}
