import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, Repository, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Entity('users') 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  contactNumber: string;

  @Column({default: 'user'})
  role:string;




  @BeforeInsert()
  async hashPassword(){
    this.password = await bcrypt.hash(this.password, 10);
  }
}