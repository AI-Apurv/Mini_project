import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { User } from 'src/Module/users/entity/user.entity';
import { Product } from 'src/Module/product/entity/product.entity';
import { Seller } from 'src/Module/seller/entity/seller.entity';

@Entity('Order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product,)
  @JoinColumn({ name: 'productId' })
  products: Product;

  @ManyToOne(() => Seller)
  @JoinColumn({ name: 'sellerId' })
  seller: Seller

  @Column({ nullable: true })
  sellerId: number

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  totalPrice: number;

  @CreateDateColumn()
  orderDate: Date;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  productId: number;

  @Column({ default: true })
  orderActive: boolean

  @Column()
  addressId: number;

  @Column({ default: false })
  orderDelivered: boolean

  @Column({ nullable: true })
  orderStatus: number





}
