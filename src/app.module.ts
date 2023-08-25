import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './Module/users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './Module/users/user.controller';
import { UserService } from './Module/users/user.service';
import { UsersModule } from './Module/users/user.module';
import typeOrmConfig from './providers/database/db.connection';
// import { Admin } from './Module/admin/entity/admin.entity';
import { AdminModule } from './Module/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { SellerModule } from './Module/seller/seller.module';
import { ProductModule } from './Module/product/product.module';
import { CartModule } from './Module/users/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AdminModule,
    SellerModule,
    ProductModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
