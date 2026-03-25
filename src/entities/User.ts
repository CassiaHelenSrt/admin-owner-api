import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Client } from "./Client";
import { Product } from "./Product";

export enum UserRole {
    ADMIN = "admin",
    EMPLOYEE = "employee",
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
    products!: Product[];
}
