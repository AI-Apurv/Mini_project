import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entity/review.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Order } from 'src/Module/orders/entity/order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Review,Order])],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewsModule {}
