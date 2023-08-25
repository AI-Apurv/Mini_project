
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from 'src/Module/admin/productCategory/entity/category.entity';

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
}
