import { Module } from '@nestjs/common';
import { OrderController } from './orders.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { Cart } from '../users/cart/entity/cart.entity';
import { Product } from '../product/entity/product.entity';
import { AddressService } from '../users/address/address.service';
import { AddressModule } from '../users/address/address.module';
import { Address } from '../users/address/entity/address.entity';
import { Statement } from './statements/entity/statement.entity';
import { StatementModule } from './statements/statement.module';
import { Seller } from '../seller/entity/seller.entity';
import { httpResponse } from 'src/Middleware/httpResponse';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Cart, Product, Address, Statement,]),
    StatementModule
  ],
  controllers: [OrderController],
  providers: [OrderService,httpResponse]
})
export class OrdersModule { }
