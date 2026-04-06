import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("availabilitys")
export class Availability {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    dayOfWeek!: number; // 0 = domingo ... 6 = sábado

    @Column()
    startHour!: string; // "08:00"

    @Column()
    endHour!: string; // "18:00"
}
