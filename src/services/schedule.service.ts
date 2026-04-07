import { AppDataSource } from "../config/data-source";
import { Availability } from "../entities/Availability";
import { Client } from "../entities/Client";
import { Product } from "../entities/Product";
import { Schedule } from "../entities/Schedule";
import { User } from "../entities/User";
import { CreateScheduleDTO } from "../types/CreateScheduleDTO ";

export class ScheduleService {
    private scheduleRepo = AppDataSource.getRepository(Schedule);
    private productRepo = AppDataSource.getRepository(Product);
    private availabilityRepo = AppDataSource.getRepository(Availability);

    async createSchedule(data: CreateScheduleDTO) {
        const { clientId, userId, productId, startTime } = data;

        const start = new Date(startTime);

        // 🔹 validar usuário
        const user = await this.scheduleRepo.manager.findOne(User, {
            where: { id: userId },
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        // 🔹 validar cliente
        const client = await this.scheduleRepo.manager.findOne(Client, {
            where: {
                id: clientId,
                user: { id: userId },
            },
        });

        if (!client) {
            throw new Error("Cliente não encontrado");
        }

        // 🔹 validar produto
        const product = await this.productRepo.findOneBy({ id: productId });

        console.log("product", product);

        if (!product) {
            throw new Error("Produto não encontrado");
        }

        // 🔹 calcular horário final
        const endTime = new Date(start);
        endTime.setMinutes(endTime.getMinutes() + product.duration);

        // 🔹 não permitir passado
        if (start < new Date()) {
            throw new Error("Não pode agendar no passado");
        }

        //VALIDAÇÃO DE DISPONIBILIDADE (NOVO)
        const dayOfWeek = start.getDay();

        const availabilities = await this.availabilityRepo.find({
            where: {
                user: { id: userId },
                dayOfWeek,
            },
        });

        if (availabilities.length === 0) {
            throw new Error("Usuário não possui disponibilidade para este dia");
        }

        const startStr = start.toTimeString().slice(0, 5);
        const endStr = endTime.toTimeString().slice(0, 5);

        const isWithinAvailability = availabilities.some((av) => {
            return startStr >= av.startHour && endStr <= av.endHour;
        });

        if (!isWithinAvailability) {
            throw new Error("Horário fora da disponibilidade");
        }

        // 🔥 🔒 VALIDAÇÃO DE CONFLITO
        const conflict = await this.scheduleRepo
            .createQueryBuilder("schedule")
            .leftJoin("schedule.user", "user")
            .where("user.id = :userId", { userId })
            .andWhere("schedule.startTime < :endTime", { endTime })
            .andWhere("schedule.endTime > :start", { start })
            .getOne();

        if (conflict) {
            throw new Error("Horário já está ocupado");
        }

        // 🔹 criar agendamento
        const schedule = this.scheduleRepo.create({
            client,
            user,
            product,
            startTime: start,
            endTime,
        });

        console.log("service schedule", schedule);

        return await this.scheduleRepo.save(schedule);
    }
}
