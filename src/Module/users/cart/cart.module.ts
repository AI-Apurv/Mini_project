import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entity/cart.entity';
import { Product } from 'src/Module/product/entity/product.entity';
import { JwtStrategy } from 'src/Middleware/jwt.strategy';
import { UserService } from '../user.service';
import { User } from '../entity/user.entity';
import { httpResponse } from 'src/Middleware/httpResponse';

@Module({
  imports: [TypeOrmModule.forFeature([Cart,Product,User])],
  controllers: [CartController],
  providers: [CartService,JwtStrategy,httpResponse],
})
export class CartModule {}
