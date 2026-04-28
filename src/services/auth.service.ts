import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { RefreshToken } from "../entities/RefreshToken";
import dayjs from "dayjs";

const SECRET_KEY = process.env.JWT_SECRET;

export class AuthService {
    private repo = AppDataSource.getRepository(User);
    private refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

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

        if (!user || !(await bcrypt.compare(password, user.password))) {
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
            { expiresIn: "15m" },
        );

        // Primeiro, removemos tokens antigos do usuário para não encher o banco
        await this.refreshTokenRepo.delete({ userId: user.id });

        const expiresIn = dayjs().add(7, "days").unix();

        const refreshToken = this.refreshTokenRepo.create({
            userId: user.id,
            token: Math.random().toString(36).substring(2) + Date.now(), // String aleatória única
            expiresIn,
        });

        await this.refreshTokenRepo.save(refreshToken);

        return {
            token,
            refreshToken: refreshToken.token,
            user: { id: user.id, email: user.email, role: user.role },
        };
    }

    async refresh(tokenEnviado: string) {
        // 1. Busca o Refresh Token no banco
        const refreshToken = await this.refreshTokenRepo.findOne({
            where: { token: tokenEnviado },
        });

        if (!refreshToken) {
            throw new Error("Sessão inválida. Faça login novamente.");
        }

        // 2. Verifica se expirou
        const isExpired = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));
        if (isExpired) {
            await this.refreshTokenRepo.delete({ userId: refreshToken.userId });
            throw new Error("Sessão expirada. Faça login novamente.");
        }

        // --- AQUI COMEÇA A ROTAÇÃO ---

        // 3. APAGA o Refresh Token que acabou de ser usado (ele não vale mais!)
        await this.refreshTokenRepo.delete({ id: refreshToken.id });

        // 4. Busca o usuário para gerar os novos dados
        const user = await this.repo.findOne({
            where: { id: refreshToken.userId },
        });

        // 5. Gera um NOVO Access Token (15 min)
        const newToken = jwt.sign(
            { id: user!.id, role: user!.role },
            SECRET_KEY!,
            {
                expiresIn: "1m",
            },
        );

        // 6. Gera um NOVO Refresh Token (7 dias)
        const newExpiresIn = dayjs().add(7, "days").unix();
        const newRefreshToken = this.refreshTokenRepo.create({
            userId: user!.id,
            token: Math.random().toString(36).substring(2) + Date.now(),
            expiresIn: newExpiresIn,
        });

        await this.refreshTokenRepo.save(newRefreshToken);

        // 7. Retorna o NOVO PAR de tokens para o Front-end
        return {
            token: newToken,
            refreshToken: newRefreshToken.token,
        };
    }

    async logout(userId: number) {
        await this.refreshTokenRepo.delete({ userId });
    }
}
