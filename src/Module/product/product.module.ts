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
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { SellerModule } from '../seller/seller.module';
import { Review } from './reviews/entity/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category,Seller,Review]),
    MulterModule.register({
      dest: './uploads',
      // Destination folder where uploaded files will be stored
       }), ReviewsModule,SellerModule
      //  MulterModule.register(multerConfig);
  ],
  controllers: [ProductController],
  providers: [ProductService,UploadInterceptor],
  exports: [ProductService]
 
})
export class ProductModule {}
