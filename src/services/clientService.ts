import { AppDataSource } from "../config/data-source";
import { Client } from "../entities/Client";
import { User } from "../entities/User";

import { randomUUID } from "node:crypto";

export class ClientService {
    private clientRepo = AppDataSource.getRepository(Client);
    private userRepo = AppDataSource.getRepository(User);
    // private clients: Client[] = [];

    async createClient(data: any, userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }
        const email = data.email.toLowerCase().trim();

        const emailExistente = await this.clientRepo.findOne({
            where: {
                email,
                user: { id: userId },
            },
        });

        if (emailExistente) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const client = this.clientRepo.create({
            ...data,
            email,
            user,
        });

        return this.clientRepo.save(client);
    }

    // createClient(data: Omit<Client, "id" | "userId">, userId: number): Client {
    //     if (!data.name || data.name.trim().length < 2) {
    //         throw new Error("Nome do cliente é obrigatório");
    //     }

    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     const normalizedEmail = data.email.toLowerCase().trim();

    //     if (!emailRegex.test(normalizedEmail)) {
    //         throw new Error("Email inválido");
    //     }

    //     const emailExists = this.clients.find(
    //         (c) => c.email === normalizedEmail && c.userId === userId,
    //     );

    //     if (emailExists) {
    //         throw new Error("Este e-mail já está cadastrado.");
    //     }

    //     const newClient: Client = {
    //         id: randomUUID(),
    //         ...data,
    //         email: normalizedEmail,
    //         userId,
    //     };

    //     this.clients.push(newClient);

    //     return newClient;
    // }

    // getClientsByUser(userId: number): Client[] {
    //     return this.clients.filter((c) => c.userId === userId);
    // }
}
