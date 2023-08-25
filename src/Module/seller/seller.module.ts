// seller.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { Seller } from './entity/seller.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seller]),
    JwtModule.register({
      secret: 'your_secret_key', // Replace with your own secret key
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
