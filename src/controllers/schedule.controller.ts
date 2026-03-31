import { Request, Response } from "express";

import { ScheduleService } from "../services/schedule.service";

export const createSchedule = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        console.log("controller", userId);

        const service = new ScheduleService();

        const schedule = await service.createSchedule({
            ...req.body,
            userId,
        });

        return res.status(201).json(schedule);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
