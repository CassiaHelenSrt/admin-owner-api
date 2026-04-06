import { AppDataSource } from "../config/data-source";
import { Availability } from "../entities/Availability";
import { User } from "../entities/User";
import { CreateAvailabilityDTO } from "../types/CreateAvailabilityDTO";

export class AvailabilityService {
    private userRep = AppDataSource.getRepository(User);
    private availabilityRepo = AppDataSource.getRepository(Availability);

    async createAvailability(data: CreateAvailabilityDTO) {
        const { userId, dayOfWeek, startHour, endHour } = data;

        const user = await this.userRep.findOneBy({ id: userId });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const conflict = await this.availabilityRepo
            .createQueryBuilder("availability")
            .leftJoin("availability.user", "user")
            .where("user.id = :userId", { userId })
            .andWhere("availability.dayOfWeek = :dayOfWeek", { dayOfWeek })
            .andWhere("availability.startHour < :endHour", { endHour })
            .andWhere("availability.endHour > :startHour", { startHour })
            .getOne();

        if (conflict) {
            throw new Error("Já existe um horário nesse intervalo");
        }

        const availability = this.availabilityRepo.create({
            user,
            dayOfWeek,
            startHour,
            endHour,
        });

        return await this.availabilityRepo.save(availability);
    }

    async getUserAvailability(userId: number) {
        return await this.availabilityRepo.find({
            where: {
                user: { id: userId },
            },
        });
    }

    generateTimeSlots(startHour: string, endHour: string): string[] {
        const slots: string[] = [];

        let current = new Date(`1970-01-01T${startHour}:00`);
        const end = new Date(`1970-01-01T${endHour}:00`);

        while (current < end) {
            const hour = current.toTimeString().slice(0, 5);
            slots.push(hour);

            current.setHours(current.getHours() + 1);
        }

        return slots;
    }

    async getAvailableSlots(userId: number, date: string) {
        const dayOfWeek = new Date(date + "T00:00:00").getDay();

        const days = [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
        ];

        const dayName = days[dayOfWeek];

        const availabilities = await this.availabilityRepo.find({
            where: {
                user: { id: userId },
                dayOfWeek,
            },
        });

        let allSlots: string[] = [];

        for (const av of availabilities) {
            const slots = this.generateTimeSlots(av.startHour, av.endHour);
            allSlots.push(...slots);
        }

        const schedules = await AppDataSource.getRepository("Schedule")
            .createQueryBuilder("schedule")
            .where("schedule.userId = :userId", { userId })
            .andWhere("DATE(schedule.startTime) = :date", { date })
            .getMany();

        const busySlots = schedules.map((s: any) =>
            s.startTime.toTimeString().slice(0, 5),
        );

        const uniqueSlots = [...new Set(allSlots)];

        const freeSlots = uniqueSlots
            .filter((slot) => !busySlots.includes(slot))
            .sort();
        return {
            date,
            dayName,
            slots: freeSlots,
        };
    }
}
