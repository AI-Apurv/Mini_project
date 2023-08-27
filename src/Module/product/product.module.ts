// product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { Category } from '../admin/productCategory/entity/category.entity'; // Import the Category entity
import { Seller } from '../seller/entity/seller.entity';
// ... other imports

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category,Seller]), // Include Category in forFeature
    
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
 
})
export class ProductModule {}
