import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Order } from 'src/Module/orders/entity/order.entity';
import { Product } from '../entity/product.entity';
import { ProductModule } from '../product.module';
import { ProductService } from '../product.service';

@Module({
    imports: [TypeOrmModule.forFeature([Review,Order,Product])],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewsModule {}
