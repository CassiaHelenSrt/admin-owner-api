import { AppDataSource } from "../config/data-source";
import { Availability } from "../entities/Availability";
import { Product } from "../entities/Product";
import { Schedule } from "../entities/Schedule";
import { User } from "../entities/User";
import { CreateAvailabilityDTO } from "../types/CreateAvailabilityDTO";

export class AvailabilityService {
    private userRep = AppDataSource.getRepository(User);
    private availabilityRepo = AppDataSource.getRepository(Availability);
    private productRepo = AppDataSource.getRepository(Product);
    private schedule = AppDataSource.getRepository(Schedule);

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

    generateTimeSlots(
        startHour: string,
        endHour: string,
        duration: number,
    ): string[] {
        if (duration <= 0) {
            throw new Error("Duração inválida");
        }

        const slots: string[] = [];

        let current = new Date(`1970-01-01T${startHour}:00-03:00`);
        const end = new Date(`1970-01-01T${endHour}:00-03:00`);

        while (true) {
            const slotStart = new Date(current);

            const slotEnd = new Date(current);
            slotEnd.setMinutes(slotEnd.getMinutes() + duration);

            if (slotEnd > end) break;

            const hour = slotStart.toTimeString().slice(0, 5);
            slots.push(hour);

            //CORRETO
            current.setMinutes(current.getMinutes() + duration);
        }

        return slots;
    }
    async getAvailableSlots(userId: number, date: string, productId: number) {
        const product = await this.productRepo.findOneBy({ id: productId });

        if (!product) throw new Error("Produto não encontrado");
        if (product.duration <= 0) throw new Error("Duração inválida");

        const dayOfWeek = new Date(date + "T00:00:00-03:00").getDay();

        const dayName = new Date(date).toLocaleDateString("pt-BR", {
            weekday: "long",
        });

        console.log("dayName", dayName);

        // const days = [
        //     "Domingo",
        //     "Segunda",
        //     "Terça",
        //     "Quarta",
        //     "Quinta",
        //     "Sexta",
        //     "Sábado",
        // ];

        // const dayName = days[dayOfWeek];

        const availabilities = await this.availabilityRepo.find({
            where: {
                user: { id: userId },
                dayOfWeek,
            },
        });

        console.log("availabilities", availabilities);

        if (availabilities.length === 0) {
            return {
                date,
                slots: [],
            };
        }

        let allSlots: string[] = [];

        for (const av of availabilities) {
            const slots = this.generateTimeSlots(
                av.startHour,
                av.endHour,
                product.duration,
            );

            allSlots.push(...slots);
        }

        const schedules = await this.schedule
            .createQueryBuilder("schedule")
            .where("schedule.userId = :userId", { userId })
            .andWhere("DATE(schedule.startTime) = :date", { date })
            .getMany();

        const uniqueSlots = [...new Set(allSlots)].sort((a, b) =>
            a.localeCompare(b),
        );

        const slots = uniqueSlots.map((slot) => {
            const slotStart = new Date(`${date}T${slot}:00-03:00`);

            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + product.duration);

            const isOccupied = schedules.some((schedule: any) => {
                return (
                    slotStart < schedule.endTime && slotEnd > schedule.startTime
                );
            });

            return {
                time: slot,
                available: !isOccupied,
            };
        });

        return {
            date,
            dayName,
            slots,
        };
    }
}
