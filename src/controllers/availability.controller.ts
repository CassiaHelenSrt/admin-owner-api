import { Request, Response } from "express";
import { AvailabilityService } from "../services/availability.service";

const service = new AvailabilityService();

export const createAvailability = async (req: Request, res: Response) => {
    try {
        const availability = await service.createAvailability(req.body);

        return res.status(201).json(availability);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAvailability = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.userId);

        const data = await service.getUserAvailability(userId);

        return res.json(data);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;
        const { date } = req.query;

        if (!userId) {
            return res.status(401).json({
                message: "Usuário não autenticado",
            });
        }

        if (!date) {
            return res.status(400).json({
                message: "date é obrigatório",
            });
        }

        if (!productId || isNaN(Number(productId))) {
            return res.status(400).json({
                message: "productId inválido",
            });
        }

        if (!date) {
            return res.status(400).json({
                message: "date é obrigatório",
            });
        }

        const data = await service.getAvailableSlots(
            userId!,
            String(date),
            Number(productId),
        );

        return res.json(data);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};
