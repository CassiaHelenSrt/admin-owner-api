import { Request, Response } from "express";

import { ClientService } from "../services/clientService";
import { UserRole } from "../entities/User";

import path from "path";
import * as fs from "fs";

const clientService = new ClientService();

// export const createClient = async (req: Request, res: Response) => {
//     try {
//         const { name, phone, email } = req.body;

//         const userId = req.user?.id;

//         const client = await clientService.createClient(
//             { name, phone, email },
//             userId!,
//         );

//         res.status(201).json(client);
//     } catch (error: any) {
//         res.status(400).json({ message: error.message });
//     }
// };

export const createClient = async (req: Request, res: Response) => {
    try {
        const bodySanitizado: any = {};

        for (const key in req.body) {
            bodySanitizado[key.trim()] = req.body[key];
        }

        const { name, phone, email } = bodySanitizado;
        const userId = req.user?.id;

        const clientData: any = { name, phone, email };

        if (req.file) {
            clientData.photo = `uploads/clients/${req.file.filename}`;
        }

        const client = await clientService.createClient(clientData, userId!);
        res.status(201).json(client);
    } catch (error: any) {
        // SE DEU ERRO e o Multer já tinha salvado um arquivo, nós apagamos ele aqui!

        if (req.file) {
            const caminhoDoArquivo = path.resolve(
                __dirname,
                `../../uploads/clients/${req.file.filename}`,
            );

            // Verifica se o arquivo realmente existe na pasta antes de apagar
            if (fs.existsSync(caminhoDoArquivo)) {
                fs.unlinkSync(caminhoDoArquivo); // Apaga a foto do computador
            }
        }

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
        const userRole = req.user?.role as UserRole;

        if (!userId) {
            return res
                .status(401)
                .json({ message: "Usuário não autenticado." });
        }

        const clients = await clientService.getClientsByUser(userId, userRole);

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
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role as UserRole;

        // 1. Remove os espaços fantasmas das chaves do body enviado
        const bodySanitizado: any = {};
        for (const key in req.body) {
            bodySanitizado[key.trim()] = req.body[key];
        }
        const { name, phone, email } = bodySanitizado;

        const updateData: any = { name, phone, email };

        if (req.file) {
            updateData.photo = `uploads/products/${req.file.filename}`;
        }

        // 3. Tenta atualizar o cliente no banco de dados
        const updatedClient = await clientService.updateClient(
            Number(id),
            userId!,
            updateData,
            userRole,
        );

        res.json(updatedClient);
    } catch (error: any) {
        // 5. SE DEU ERRO (ex: e-mail repetido) e o Multer já tinha salvado a nova foto, nós apagamos ela
        if (req.file) {
            const caminhoNovaFoto = path.resolve(
                __dirname,
                `../../uploads/clients/${req.file.filename}`,
            );
            if (fs.existsSync(caminhoNovaFoto)) {
                fs.unlinkSync(caminhoNovaFoto); // Apaga a foto nova porque a atualização falhou
            }
        }

        res.status(400).json({ message: error.message });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id; // Pegando o ID de quem está logado
        const userRole = req.user?.role as UserRole; // Captura o cargo do usuário

        // Passamos os dois IDs para o service conferir
        await clientService.deleteClient(Number(id), userId!, userRole);

        res.status(204).send();
    } catch (error: any) {
        // Corrigido para .message
        res.status(400).json({ message: error.message });
    }
};
