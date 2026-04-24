import { AppDataSource } from "../config/data-source";
import { Client } from "../entities/Client";

import { User, UserRole } from "../entities/User";

export class ClientService {
    private clientRepo = AppDataSource.getRepository(Client);
    private userRepo = AppDataSource.getRepository(User);

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

    async getAllClients() {
        // Retorna todos os clientes cadastrados no sistema global
        return await this.clientRepo.find();
    }

    async getClientsByUser(userId: number, userRole: UserRole) {
        const whereCondition =
            userRole === UserRole.ADMIN ? {} : { user: { id: userId } };

        return await this.clientRepo.find({
            where: whereCondition,
        });
    }

    async getClientById(clientId: number, userId: number) {
        const client = await this.clientRepo.findOne({
            where: {
                id: clientId,
                user: { id: userId },
            },
            relations: ["schedules"],
        });

        if (!client) {
            throw new Error(
                "Cliente não encontrado ou você não tem permissão.",
            );
        }

        return client;
    }

    async updateClient(
        clientId: number,
        userId: number,
        data: any,
        userRole: UserRole,
    ) {
        // Condição: Admin vê tudo | Employee vê apenas o dele
        const whereCondition =
            userRole === UserRole.ADMIN
                ? { id: clientId }
                : { id: clientId, user: { id: userId } };

        const client = await this.clientRepo.findOne({ where: whereCondition });

        if (!client) {
            throw new Error(
                "Cliente não encontrado ou sem permissão para editar.",
            );
        }

        if (data.email) {
            const email = data.email.toLowerCase().trim();
            const emailExistente = await this.clientRepo.findOne({
                where: {
                    email,
                    user: { id: userId },
                },
            });

            if (emailExistente && emailExistente.id !== clientId) {
                throw new Error(
                    "Este e-mail já está cadastrado em outro cliente.",
                );
            }

            data.email = email;
        }

        delete data.id;
        delete data.user;
        delete data.userId;

        this.clientRepo.merge(client, data);
        return await this.clientRepo.save(client);
    }

    async deleteClient(clientId: number, userId: number, userRole: UserRole) {
        const whereCondition =
            userRole === UserRole.ADMIN
                ? { id: clientId }
                : { id: clientId, user: { id: userId } };

        // Busca o cliente garantindo que ele pertença ao usuário logado
        const client = await this.clientRepo.findOne({
            where: whereCondition,
            relations: ["schedules"],
        });

        if (!client) {
            throw new Error(
                "Cliente não encontrado ou você não tem permissão para excluí-lo.",
            );
        }

        if (client.schedules && client.schedules.length > 0) {
            throw new Error(
                "Este cliente possui agendamentos vinculados e não pode ser excluído.",
            );

            // exemplo de erro para mudar depois
            // return res.status(409).json({
            //     message: "Cliente possui agendamentos e não pode ser removido.",
            // });
        }

        // Remove o registro do banco
        return await this.clientRepo.remove(client);
    }
}
