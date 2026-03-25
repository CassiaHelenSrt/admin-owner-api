import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

const SECRET_KEY = process.env.JWT_SECRET;

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
            select: ["id", "email", "password", "role"],
        });

        if (!user) {
            throw new Error("Email ou senha inválidos");
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new Error("Email ou senha inválidos");
        }

        if (!SECRET_KEY) {
            throw new Error("JWT_SECRET não definido");
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            SECRET_KEY,
            { expiresIn: "1h" },
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
}
