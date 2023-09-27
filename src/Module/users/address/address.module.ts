// address/address.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entity/address.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { User } from '../entity/user.entity';
import { httpResponse } from 'src/Middleware/httpResponse';

@Module({
  imports: [TypeOrmModule.forFeature([Address,User])],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
