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
  quantity: number;

  @Column({nullable: true})
  totalPrice: number;

  // @Column({nullable:true})
  // email: number;

  @CreateDateColumn()
  orderDate: Date;

  @Column({nullable:true})
  userId : number;

  @Column({nullable: true})
  productId: number;

  @Column({default: true})
  orderActive: true

 



  // Add more fields as needed, such as total price, order date, etc.
}
