// cart.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entity/cart.entity';
import { Product } from 'src/Module/product/entity/product.entity';
import { JwtStrategy } from 'src/Middleware/jwt.strategy';



@Module({
  imports: [TypeOrmModule.forFeature([Cart,Product])],
  controllers: [CartController],
  providers: [CartService,JwtStrategy],
})
export class CartModule {}
