import { Request, Response } from "express";

import { ClientService } from "../service/clientService";

const clientService = new ClientService();

// export const createClient = (req: Request, res: Response) => {
//     try {
//         const client = clientService.createClient(
//             req.body,
//             req.user!.id, //token
//         );

//         return res.status(201).json(client);
//     } catch (error: any) {
//         return res.status(400).json({ message: error.message });
//         //austar depois este erro
//     }
// };

export const createClient = (req: Request, res: Response) => {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    try {
        if (!req.user?.id) {
            return res.status(400).json({ message: "Usuário inválido" });
        }

        const client = clientService.createClient(req.body, req.user.id);

        return res.status(201).json(client);
    } catch (error: any) {
        console.log("ERRO:", error); // 👈 ADICIONA ISSO

        return res.status(400).json({
            message: error.message || "Erro ao criar cliente",
        });
    }
};

export const getClients = (req: Request, res: Response) => {
    const clients = clientService.getClientsByUser(req.user!.id);
    res.json(clients);
};
