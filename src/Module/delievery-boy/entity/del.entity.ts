import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('delivery_boys') 
export class DeliveryBoy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true }) 
  email: string;

  @Column()
  password: string;

  @Column({ default: 'dboy' })
  role: string;
}
