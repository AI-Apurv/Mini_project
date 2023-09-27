import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Event')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  eventDate: string;



}
