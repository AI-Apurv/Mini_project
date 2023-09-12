import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../entity/user.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  addressId: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @ManyToOne(()=> User)
  @JoinColumn({name: 'userId'})
  user:number

}
