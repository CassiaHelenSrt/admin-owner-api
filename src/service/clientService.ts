import { Client } from "../types/Client";
import { randomUUID } from "node:crypto";

export class ClientService {
    private clients: Client[] = [];

    createClient(data: Omit<Client, "id" | "userId">, userId: number): Client {
        if (!data.name || data.name.trim().length < 2) {
            throw new Error("Nome do cliente é obrigatório");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const normalizedEmail = data.email.toLowerCase().trim();

        if (!emailRegex.test(normalizedEmail)) {
            throw new Error("Email inválido");
        }

        const emailExists = this.clients.find(
            (c) => c.email === normalizedEmail && c.userId === userId,
        );

        if (emailExists) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const newClient: Client = {
            id: randomUUID(),
            ...data,
            email: normalizedEmail,
            userId,
        };

        this.clients.push(newClient);

        return newClient;
    }

    getClientsByUser(userId: number): Client[] {
        return this.clients.filter((c) => c.userId === userId);
    }
}
