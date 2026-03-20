import { Client } from "../types/Client";

export class ClientService {
    private clients: Client[] = [];

    createClient(data: Omit<Client, "id" | "userId">, userId: number): Client {
        const newClient: Client = {
            id: Date.now(),
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
