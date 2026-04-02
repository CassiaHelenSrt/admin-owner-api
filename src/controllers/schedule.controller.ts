import { Request, Response } from "express";

import { ScheduleService } from "../services/schedule.service";

interface AuthRequest extends Request {
    user?: { id: number; role: string };
}
export const createSchedule = async (req: AuthRequest, res: Response) => {
    try {
        const { clientId, productId, startTime } = req.body;

        const userId = req.user?.id;

        if (!userId) {
            console.log("SEM USER ❌");
            return res.status(401).json({ message: "Usuário não autenticado" });
        }

        const service = new ScheduleService();

        const schedule = await service.createSchedule({
            clientId,
            productId,
            startTime,
            userId: userId!,
        });

        console.log("schedule", schedule);
        console.log("controller", userId);

        return res.status(201).json(schedule);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
