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
import { ElasticsearchService } from '../elasticSearch/elasticsearch.service';
import { ElasticsearchModule } from '../elasticSearch/elasticsearch.module';
import { JwtSellerAuthGuard } from 'src/Middleware/jwt.auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category,Seller,Review]),
    MulterModule.register({
      dest: './uploads'}),
      ReviewsModule,SellerModule,ElasticsearchModule
      //  MulterModule.register(multerConfig);
  ],
  controllers: [ProductController],
  providers: [ProductService,UploadInterceptor,ElasticsearchService,JwtSellerAuthGuard],
  exports: [ProductService]
 
})
export class ProductModule {}
