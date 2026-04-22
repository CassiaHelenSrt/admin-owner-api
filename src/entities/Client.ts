import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Unique } from "typeorm";
import { User } from "./User";
import { Schedule } from "./Schedule";

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

    @OneToMany(() => Schedule, (schedule) => schedule.client)
    schedules!: Schedule[];
}
