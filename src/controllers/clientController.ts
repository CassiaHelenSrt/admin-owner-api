import { Request, Response } from "express";

import { ClientService } from "../services/clientService";

const clientService = new ClientService();

export const createClient = (req: Request, res: Response) => {
    try {
        const client = clientService.createClient(
            req.body,
            req.user!.id, //token
        );

        return res.status(201).json(client);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
        //austar depois este erro
    }
};

export const getClients = (req: Request, res: Response) => {
    const clients = clientService.getClientsByUser(req.user!.id);
    res.json(clients);
};
