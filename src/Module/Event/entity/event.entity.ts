import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity('Event')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @Column({ type: 'timestamp' })
  // eventDate: Date;

  @Column()
  eventDate: string;

 
   
}
