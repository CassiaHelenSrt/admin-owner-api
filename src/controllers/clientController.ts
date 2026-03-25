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

// export const getClients = (req: Request, res: Response) => {
//     const clients = clientService.getClientsByUser(req.user!.id);
//     res.json(clients);
// };
