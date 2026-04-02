import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Client } from "./Client";
import { Product } from "./Product";
import { Schedule } from "./Schedule";

export enum UserRole {
    ADMIN = "admin",
    EMPLOYEE = "employee",
    CLIENT = "client",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.EMPLOYEE,
    })
    role!: UserRole;

    @OneToMany(() => Client, (client) => client.user)
    clients!: Client[];

    @OneToMany(() => Product, (product) => product.user)
    products!: Product[];

    @OneToMany(() => Schedule, (schedule) => schedule.user)
    schedules!: Schedule[];
}
