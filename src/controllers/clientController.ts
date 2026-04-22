import { Request, Response } from "express";

import { ClientService } from "../services/clientService";

const clientService = new ClientService();

export const createClient = async (req: Request, res: Response) => {
    try {
        const { name, phone, email } = req.body;

        const userId = req.user?.id;

        const client = await clientService.createClient(
            { name, phone, email },
            userId!,
        );

        res.status(201).json(client);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await clientService.getAllClients();
        res.json(clients);
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao buscar todos os clientes." });
    }
};

export const getClientsByUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res
                .status(401)
                .json({ message: "Usuário não autenticado." });
        }

        const clients = await clientService.getClientsByUser(userId);

        res.json(clients);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getClientDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const client = await clientService.getClientById(Number(id), userId!);

        res.status(200).json(client);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // O ID do cliente vem da URL: /clients/:id
        const { name, phone, email } = req.body;
        const userId = req.user?.id;

        const updatedClient = await clientService.updateClient(
            Number(id),
            userId!,
            { name, phone, email },
        );

        res.json(updatedClient);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Pegando o ID de quem está logado

        // Passamos os dois IDs para o service conferir
        await clientService.deleteClient(Number(id), userId!);

        res.status(204).send();
    } catch (error: any) {
        // Corrigido para .message
        res.status(400).json({ message: error.message });
    }
};
