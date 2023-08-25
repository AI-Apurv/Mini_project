// seller.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('Seller')
export class Seller {
  @PrimaryGeneratedColumn()
  sellerid: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  contactNumber: string|null ;

  @Column({ default: false })
  verify: boolean;

  @Column({default: 'seller'})
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

 
}
