import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Client } from "./Client";
import { Product } from "./Product";

@Entity("schedules")
export class Schedule {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Client)
    client!: Client;

    @ManyToOne(() => User, (user) => user.schedules)
    user!: User;

    @ManyToOne(() => Product)
    product!: Product;

    @Column()
    startTime!: Date;

    @Column()
    endTime!: Date;
}
