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
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "date é obrigatório",
            });
        }

        const data = await service.getAvailableSlots(userId!, String(date));

        return res.json(data);
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
};
