import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../entity/user.entity';
import { Product } from 'src/Module/product/entity/product.entity';

@Entity('Cart')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
  // user:number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;
  // product:number;

  @Column()
  quantity: number;
 
  @Column()
  price: number
  
}