import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Unique } from "typeorm";
import { User } from "./User";

@Unique(["email", "user"])
@Entity("clients")
export class Client {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    phone!: string;

    @ManyToOne(() => User, (user) => user.clients)
    user!: User;
}
