// product.controller.ts
import { Controller, Post, Body, UseGuards, Get, Param, Request, UnauthorizedException, Patch, Query, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseMessages } from 'src/common/responses/product.response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}


  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({summary:'Add products'})
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async createProduct(@Body() createProductDto: CreateProductDto,
                      // @UploadedFile() Image: Express.Multer.File,
                      @Request() req: any) {
    const seller = req.user;
    if(seller.role !== 'seller'){
        throw new UnauthorizedException(ProductResponseMessages.UNAUTHORIZED_ACTION)
    }
    // if(seller.verify === false)
    // {
    //   throw new UnauthorizedException('You are not a verified seller')
    // }
    console.log(seller.verify,'------------------verify')
    const sellerId = req.user.userId;
    // if(Image){
    //   createProductDto.Image = Image.filename;
    // }
    await this.productService.createProduct(createProductDto,sellerId);
    return { message: ProductResponseMessages.PRODUCT_CREATED };
  }

  @ApiOperation({summary:'Update the products'})
  @UseGuards(JwtAuthGuard)
  @Patch('update/:productId')
  async updateProduct(@Param('productId') productId:number,
                      @Body() updateProductDto:UpdateProductDto,
                      @Request() req)
  {
      const updateProduct = await this.productService.updateProduct(productId, updateProductDto, req.user.userId);
      return updateProduct;
  }

  @ApiOperation({summary:'Get product category'})
  @Get()
  getProductCategories() {
    const categoriesWithCounts = [
      'Mens--1',
      'Women--2',
      'Kids--3'
    ];
    return categoriesWithCounts;
  }
  @ApiOperation({summary:'Get Product details'})
  @Get(':parentId')
  async getCategoryDetails(@Param('parentId') parentId: number) {
    const details = await this.productService.getCategoryDetailsByParentId(parentId);
    return details;
  }

  @ApiOperation({summary:'Get Product details'})
  @Get('product-details/:productId')
  async getProductDetails(@Param('productId') productId: number,
                          @Query('page',ParseIntPipe) page: number = 1,
                          @Query('limit',ParseIntPipe) limit: number= 10){
    console.log('inside controller',productId)
    const details = await this.productService.getProducts(productId,page,limit)
    return details;
  }

  
}
