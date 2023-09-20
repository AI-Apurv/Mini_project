import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from 'src/Module/admin/productCategory/entity/category.entity';
import { Cart } from 'src/Module/users/cart/entity/cart.entity';
import { Order } from 'src/Module/orders/entity/order.entity';
import { Seller } from 'src/Module/seller/entity/seller.entity';
import { Blob } from 'buffer';
import { BlobDataType } from 'sequelize';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  productid: number;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  // @Column({ nullable: true })
  // image: string; 

  @Column('bytea', {nullable: true})
  image: Buffer 

  @Column({type:'float',default: 0})
  Rating: number
  
  @ManyToOne(() => Category, { onDelete: 'SET NULL' }) // Define relationship with Category entity
  @JoinColumn({ name: 'categoryId' })
  category: Category;


  @ManyToOne(() => Seller )
  @JoinColumn({name: 'SellerId'})
  seller: Seller

  @ManyToOne(() => Order, order=> order.products)// new change 
  order: Order

  
  @Column({default:0})
  totalReview: number



 


}
