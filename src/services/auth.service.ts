import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
const SECRET_KEY = "3fa38e665f28951d5f4e4706770cf0465f0c901a";

// const users = [
//     { id: 1, username: "admin", password: "123456", role: "admin" },
//     { id: 2, username: "cassia", password: "123456", role: "user" },
// ];

export class AuthService {
    private repo = AppDataSource.getRepository(User);

    async createUser(name: string, email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.repo.create({
            name,
            email,
            password: hashedPassword,
        });

        return this.repo.save(user);
    }

    async login(email: string, password: string) {
        const user = await this.repo.findOne({
            where: { email },
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new Error("Senha inválida");
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            SECRET_KEY,
            { expiresIn: "1h" },
        );

        return { token };
    }
}
