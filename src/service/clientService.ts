import { Client } from "../types/Client";
import { randomUUID } from "node:crypto";

export class ClientService {
    private clients: Client[] = [];

    createClient(data: Omit<Client, "id" | "userId">, userId: number): Client {
        if (!data.name || data.name.trim().length < 2) {
            throw new Error("Nome do cliente é obrigatório");
        }

        if (!data.email?.includes("@")) {
            throw new Error("Email inválido");
        }

        const emailExists = this.clients.find(
            (c) => c.email === data.email && c.userId === userId,
        );

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email)) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const newClient: Client = {
            id: randomUUID(),
            ...data,
            userId,
        };

        this.clients.push(newClient);

        return newClient;
    }

    getClientsByUser(userId: number): Client[] {
        return this.clients.filter((c) => c.userId === userId);
    }
}
