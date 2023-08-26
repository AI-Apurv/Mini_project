import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Cart } from '../users/cart/entity/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order,Cart,])],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrdersModule {}
