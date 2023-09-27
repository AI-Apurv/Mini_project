// product-category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryController } from './productCategory.controller';
import { CategoryService } from './productCategory.service';
import { JwtStrategy } from 'src/Middleware/jwt.strategy';
import { User } from 'src/Module/users/entity/user.entity';
import { httpResponse } from 'src/Middleware/httpResponse';
import { JwtAdminAuthGuard } from 'src/Middleware/jwt.auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Category, User])],
  controllers: [CategoryController],
  providers: [CategoryService, JwtStrategy, JwtAdminAuthGuard, httpResponse],
})
export class ProductCategoryModule { }
