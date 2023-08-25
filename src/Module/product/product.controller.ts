// product.controller.ts
import { Controller, Post, Body, UseGuards, Get, Param, Request, UnauthorizedException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

 
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async createProduct(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    const seller = req.user;
    console.log(seller.role,seller.sellerid)
    if(seller.role !== 'seller'){
        throw new UnauthorizedException('You are not authorizede to perform this action')
    }
    await this.productService.createProduct(createProductDto);
    return { message: 'Product created successfully.' };
  }

 
  @Get()
  getProductCategories() {
    const categoriesWithCounts = [
      'Mens--1',
      'Women--2',
      'Kids--3'
    ];
    return categoriesWithCounts;
  }

  @Get(':parentId')
  async getCategoryDetails(@Param('parentId') parentId: number) {
    const details = await this.productService.getCategoryDetailsByParentId(parentId);
    return details;
  }

  @Get('product-details/:productId')
  async getProductDetails(@Param('productId') productId: number){
    console.log('inside controller',productId)
    const details = await this.productService.getProducts(productId)
    return details;
  }

  
}
