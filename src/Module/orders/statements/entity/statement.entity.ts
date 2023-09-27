import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Order } from '../../entity/order.entity';

@Entity('Statement')
export class Statement {
  @PrimaryGeneratedColumn()
  statementId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: number;

  @Column({ nullable: true })
  creditId: number;

  @Column()
  debitId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
}
