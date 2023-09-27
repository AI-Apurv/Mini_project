import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entity/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminStrategy, JwtStrategy } from 'src/Middleware/jwt.strategy';
import { ProductCategoryModule } from './productCategory/productCategory.module';
import { Seller } from '../seller/entity/seller.entity';
import { httpResponse } from 'src/Middleware/httpResponse';
import { User } from '../users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Seller,User]),
  ConfigModule.forRoot(),
  JwtModule.register({
    secret: 'admin_secret_key',
    signOptions: { expiresIn: '1h' },
  }),
    ProductCategoryModule
  ],
  providers: [AdminService, JwtStrategy,JwtAdminStrategy, httpResponse],
  controllers: [AdminController],
  exports: [AdminService],
})

export class AdminModule implements OnModuleInit {
  constructor(private readonly adminService: AdminService) { }

  async onModuleInit() {
    await this.adminService.initAdmin();
  }
}
