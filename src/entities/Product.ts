import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { Schedule } from "./Schedule";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    type!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column()
    duration!: number;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    photo!: string;

    @ManyToOne(() => User, (user) => user.products, {
        nullable: false,
        onDelete: "CASCADE",
    })
    user!: User;

    @OneToMany(() => Schedule, (schedule) => schedule.product)
    schedules!: Schedule[];
}
