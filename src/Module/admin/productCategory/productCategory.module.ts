// product-category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { CategoryController } from './productCategory.controller'; 
import { CategoryService } from './productCategory.service';
import { JwtStrategy } from 'src/Middleware/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService,JwtStrategy],
})
export class ProductCategoryModule {}
