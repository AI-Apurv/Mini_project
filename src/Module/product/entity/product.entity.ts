
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from 'src/Module/admin/productCategory/entity/category.entity';
import { Cart } from 'src/Module/users/cart/entity/cart.entity';
import { Order } from 'src/Module/orders/entity/order.entity';

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

  @ManyToOne(() => Category, { onDelete: 'SET NULL' }) // Define relationship with Category entity
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Order, order=> order.products)// new change 
  order: Order




 


}
