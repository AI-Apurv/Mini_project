// src/module/admin/admin.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entity/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/Middleware/jwt.strategy';
import { ProductCategoryModule } from './productCategory/productCategory.module';
import { Seller } from '../seller/entity/seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin,Seller]),
  ConfigModule.forRoot(),
  JwtModule.register({
    secret: 'your_secret_key', // Change this to your own secret key
    signOptions: { expiresIn: '1h' }, // Token expiration time
  }),
  ProductCategoryModule
],
  providers: [AdminService,JwtStrategy],
  controllers: [AdminController],
  exports: [AdminService],
})
// export class AdminModule {}

//trying new something 
export class AdminModule implements OnModuleInit {
    constructor(private readonly adminService: AdminService) {}
  
    async onModuleInit() {
      await this.adminService.initAdmin();
    }
  }
