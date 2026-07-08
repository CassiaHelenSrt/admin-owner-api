import { Request, Response } from "express";

import { ClientService } from "../services/clientService";
import { UserRole } from "../entities/User";
import { CreateClientDTO, UpdateClientDTO } from "../types/CreateClientDTO";
import { getErrorMessage } from "../utils/errors";

import path from "path";
import * as fs from "fs";

const clientService = new ClientService();

function sanitizeBody(body: Record<string, string>): Record<string, string> {
    const sanitized: Record<string, string> = {};

    for (const key in body) {
        sanitized[key.trim()] = body[key];
    }

    return sanitized;
}

export const createClient = async (req: Request, res: Response) => {
    try {
        const bodySanitizado = sanitizeBody(req.body);

        const { name, phone, email } = bodySanitizado;
        const userId = req.user?.id;

        const clientData: CreateClientDTO = { name, phone, email };

        if (req.file) {
            clientData.photo = `uploads/clients/${req.file.filename}`;
        }

        const client = await clientService.createClient(clientData, userId!);
        res.status(201).json(client);
    } catch (error) {
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

        res.status(400).json({ message: getErrorMessage(error) });
    }
};

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await clientService.getAllClients();
        res.json(clients);
    } catch (error) {
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
    } catch (error) {
        res.status(500).json({ message: getErrorMessage(error) });
    }
};

export const getClientDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const client = await clientService.getClientById(Number(id), userId!);

        res.status(200).json(client);
    } catch (error) {
        res.status(404).json({ message: getErrorMessage(error) });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role as UserRole;

        const bodySanitizado = sanitizeBody(req.body);
        const { name, phone, email } = bodySanitizado;

        const updateData: UpdateClientDTO = { name, phone, email };

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
    } catch (error) {
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

        res.status(400).json({ message: getErrorMessage(error) });
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
    } catch (error) {
        res.status(400).json({ message: getErrorMessage(error) });
    }
};
