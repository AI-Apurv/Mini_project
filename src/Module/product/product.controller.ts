// product.controller.ts
import { Controller, Post, Body, UseGuards, Get, Param, Request, UnauthorizedException, Patch, Query, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

 
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async createProduct(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    const seller = req.user;
    if(seller.role !== 'seller'){
        throw new UnauthorizedException('You are not authorizede to perform this action')
    }
    // if(seller.verify === false)
    // {
    //   throw new UnauthorizedException('You are not a verified seller')
    // }
    console.log(seller.verify,'------------------verify')
    const sellerId = req.user.userId;
    await this.productService.createProduct(createProductDto,sellerId);
    return { message: 'Product created successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:productId')
  async updateProduct(@Param('productId') productId:number,
                      @Body() updateProductDto:UpdateProductDto,
                      @Request() req)
  {
      const updateProduct = await this.productService.updateProduct(productId, updateProductDto, req.user.userId);
      return updateProduct;
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
  async getProductDetails(@Param('productId') productId: number,
                          @Query('page',ParseIntPipe) page: number = 1,
                          @Query('limit',ParseIntPipe) limit: number= 10){
    console.log('inside controller',productId)
    const details = await this.productService.getProducts(productId,page,limit)
    return details;
  }

  
}
