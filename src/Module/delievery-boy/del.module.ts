import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryBoy } from './entity/del.entity';
import { DeliveryBoyController } from './del.controller';
import { DeliveryBoyService } from './del.service';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/Middleware/jwt.strategy';
import { Order } from '../orders/entity/order.entity';
import { User } from '../users/entity/user.entity';
import { httpResponse } from 'src/Middleware/httpResponse';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryBoy,Order,User]),
   JwtModule.register({ 
    secret: 'deliveryBoy_secret_key', 
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [DeliveryBoyController],
  providers: [DeliveryBoyService,JwtStrategy,httpResponse],
  exports: [DeliveryBoyService], 
})
export class DeliveryBoyModule {}
