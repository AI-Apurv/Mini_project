import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { Seller } from './entity/seller.entity';
import { Order } from '../orders/entity/order.entity';
import { httpResponse } from 'src/Middleware/httpResponse';
import { JwtSellerStrategy } from 'src/Middleware/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seller,Order]),
    JwtModule.register({
      secret: 'seller_secret_key', 
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),
  ],
  controllers: [SellerController],
  providers: [SellerService,httpResponse,JwtSellerStrategy],
  exports: [SellerService]
})
export class SellerModule {}
