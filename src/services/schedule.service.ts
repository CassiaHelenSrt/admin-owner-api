import { AppDataSource } from "../config/data-source";
import { Client } from "../entities/Client";
import { Product } from "../entities/Product";
import { Schedule } from "../entities/Schedule";
import { User } from "../entities/User";
import { CreateScheduleDTO } from "../types/CreateScheduleDTO ";

export class ScheduleService {
    private scheduleRepo = AppDataSource.getRepository(Schedule);
    private productRepo = AppDataSource.getRepository(Product);

    async createSchedule(data: CreateScheduleDTO) {
        const { clientId, userId, productId, startTime } = data;

        const start = new Date(startTime);

        const user = await this.scheduleRepo.manager.findOne(User, {
            where: { id: userId },
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const client = await this.scheduleRepo.manager.findOne(Client, {
            where: {
                id: clientId,
                user: { id: userId },
            },
        });

        if (!client) {
            throw new Error("Cliente não encontrado");
        }

        const product = await this.productRepo.findOneBy({ id: productId });

        if (!product) {
            throw new Error("Produto não encontrado");
        }

        const endTime = new Date(start);
        endTime.setMinutes(endTime.getMinutes() + product.duration);

        if (start < new Date()) {
            throw new Error("Não pode agendar no passado");
        }

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
