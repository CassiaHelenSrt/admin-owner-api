import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./User";
@Entity("refresh_tokens")
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token!: string;

    @Column()
    expiresIn!: number; // Timestamp de quando expira

    @Column()
    userId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user!: User;
}
