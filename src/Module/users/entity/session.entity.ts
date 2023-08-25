import { CreateDateColumn, JoinColumn, Column, OneToOne, Entity,PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('session')
export class Session {
    @PrimaryGeneratedColumn()
    id: number;
   
    @OneToOne(()=> User)
    @JoinColumn({name: 'user_id'})
    user:User;

    @Column({default: true})
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}