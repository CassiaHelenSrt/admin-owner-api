import { AppDataSource } from "../config/data-source";
import { Availability } from "../entities/Availability";
import { Client } from "../entities/Client";
import { Product } from "../entities/Product";
import { Schedule } from "../entities/Schedule";
import { User } from "../entities/User";
import { CreateScheduleDTO } from "../types/CreateScheduleDTO ";
import { AvailabilityService } from "./availability.service";

export class ScheduleService {
    private scheduleRepo = AppDataSource.getRepository(Schedule);
    private productRepo = AppDataSource.getRepository(Product);
    private availabilityRepo = AppDataSource.getRepository(Availability);

    async createSchedule(data: CreateScheduleDTO) {
        return await AppDataSource.transaction(async (manager) => {
            const { clientId, userId, productId, startTime } = data;

            const start = new Date(startTime);
            if (start < new Date()) {
                throw new Error("Não pode agendar no passado");
            }

            // 🔹 usuário
            const user = await manager.findOne(User, { where: { id: userId } });
            if (!user) throw new Error("Usuário não encontrado");

            // 🔹 cliente
            const client = await manager.findOne(Client, {
                where: { id: clientId, user: { id: userId } },
            });
            if (!client) throw new Error("Cliente não encontrado");

            // 🔹 produto
            const product = await this.productRepo.findOneBy({ id: productId });
            if (!product) throw new Error("Produto não encontrado");
            if (product.duration <= 0) throw new Error("Duração inválida");

            // 🔹 horário final
            const endTime = new Date(start);
            endTime.setMinutes(endTime.getMinutes() + product.duration);

            const dayOfWeek = start.getDay();

            const availabilities = await this.availabilityRepo.find({
                where: { user: { id: userId }, dayOfWeek },
            });

            if (availabilities.length === 0) {
                throw new Error("Sem disponibilidade nesse dia");
            }

            // 🔥 CORRIGIDO: comparação com Date
            const isWithinAvailability = availabilities.some((av) => {
                const avStart = new Date(
                    `${start.toISOString().slice(0, 10)}T${av.startHour}:00-03:00`,
                );
                const avEnd = new Date(
                    `${start.toISOString().slice(0, 10)}T${av.endHour}:00-03:00`,
                );

                return start >= avStart && endTime <= avEnd;
            });

            if (!isWithinAvailability) {
                throw new Error("Fora da disponibilidade");
            }

            // 🔥 VALIDAÇÃO EXTRA: garantir que slot é válido
            const availabilityService = new AvailabilityService();
            const { slots } = await availabilityService.getAvailableSlots(
                userId,
                start.toISOString().slice(0, 10),
                productId,
            );

            const startStr = start.toTimeString().slice(0, 5);

            const validSlot = slots.find((s) => s.time === startStr);

            console.log("startStr:", startStr);
            console.log(
                "slots:",
                slots.map((s) => s.time),
            );

            if (!validSlot || !validSlot.available) {
                throw new Error("Horário inválido ou indisponível");
            }

            //CONFLITO COM LOCK
            const conflict = await manager
                .createQueryBuilder(Schedule, "schedule")
                .setLock("pessimistic_write")
                .where("schedule.userId = :userId", { userId })
                .andWhere("schedule.startTime < :endTime", { endTime })
                .andWhere("schedule.endTime > :start", { start })
                .getOne();

            if (conflict) {
                throw new Error("Horário já ocupado");
            }

            const schedule = manager.create(Schedule, {
                client,
                user,
                product,
                startTime: start,
                endTime,
            });

            return await manager.save(schedule);
        });
    }
}
