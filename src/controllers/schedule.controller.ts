import { Request, Response } from "express";

import { ScheduleService } from "../services/schedule.service";
import { getErrorMessage } from "../utils/errors";

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
    } catch (error) {
        res.status(400).json({ message: getErrorMessage(error) });
    }
};

export const getDailySchedules = async (req: AuthRequest, res: Response) => {
    try {
        // 🔥 CORRETO PARA PRODUÇÃO: Pega o ID diretamente do token decodificado no seu Middleware de Autenticação

        const userId = req.user?.id;
        const date = req.query.date as string; // Continua vindo da URL (ex: ?date=2026-05-27)

        if (!userId || !date) {
            return res.status(400).json({
                error: "Usuário não autenticado ou data não fornecida",
            });
        }

        const service = new ScheduleService();
        const dailyData = await service.getSchedulesByDate(userId, date);

        return res.json(dailyData);
    } catch (error) {
        console.error("Erro interno na Controller:", error);
        return res.status(500).json({ error: getErrorMessage(error) });
    }
};

export const getMonthlySchedules = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id || Number(req.query.userId); // Mantém suporte a teste rápido se necessário
        const year = Number(req.query.year);
        const month = Number(req.query.month); // Espera número de 1 a 12

        if (!userId || !year || !month) {
            return res
                .status(400)
                .json({ error: "userId, year e month são obrigatórios" });
        }

        const service = new ScheduleService();
        const monthlyData = await service.getSchedulesByMonth(
            userId,
            year,
            month,
        );

        return res.json(monthlyData);
    } catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
};
