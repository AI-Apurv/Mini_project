// order.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from 'src/Module/users/entity/user.entity';
import { Product } from 'src/Module/product/entity/product.entity';

@Entity('Order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Product, product => product.order)
  @JoinColumn({ name: 'productId' })
  products: Product;

  @Column({nullable: true})
  totalPrice: number;

  @CreateDateColumn()
  orderDate: Date;

 



  // Add more fields as needed, such as total price, order date, etc.
}
