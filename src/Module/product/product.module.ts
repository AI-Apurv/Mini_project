// product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { Category } from '../admin/productCategory/entity/category.entity'; // Import the Category entity
import { Seller } from '../seller/entity/seller.entity';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer'
import { ReviewsModule } from './reviews/review.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category,Seller]),
    MulterModule.register({
      dest: './uploads',
      // Destination folder where uploaded files will be stored
       }), ReviewsModule,
      //  MulterModule.register(multerConfig);
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
 
})
export class ProductModule {}
