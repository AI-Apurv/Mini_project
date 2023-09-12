import { Controller, Post, Body, UseGuards, Get, Param, Request, UnauthorizedException, Patch, Query, ParseIntPipe, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseMessages } from 'src/common/responses/product.response';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { SellerService } from '../seller/seller.service';
import { FilterProductDto } from './dto/filterproduct.dto';
@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService,
              private readonly sellerService: SellerService) {}

 @ApiOperation({ summary: 'Get all products' })
 @Get('all')
 async getAllProducts() {
 const products = await this.productService.getAllProducts();
 return { products };
  }

  @ApiBearerAuth()
  @UseInterceptors(UploadInterceptor)
  @ApiOperation({summary:'Add products'})
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async createProduct(@Body() createProductDto: CreateProductDto,@Request() req: any) {
    const seller = await this.sellerService.getSellerById(req.user.userId)
    if (!seller || !seller.verify) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Only verified sellers are allowed to add products',
      };
    }  
    const image: Express.Multer.File = req.file;
    const imageBuffer: Buffer = image.buffer;
    const sellerId = req.user.userId;
    console.log('sellerId------------------',sellerId)
    await this.productService.createProduct(createProductDto,sellerId , imageBuffer);
    console.log('inside the controller')
    return {messsage: ProductResponseMessages.PRODUCT_CREATED}
    
  }

  @ApiBearerAuth()
  @ApiOperation({summary:'Update the products'})
  @UseGuards(JwtAuthGuard)
  @Patch('update/:productId')
  async updateProduct(@Param('productId') productId:number,
  @Body() updateProductDto:UpdateProductDto,@Request() req)
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
  async getProductDetails(@Param('productId') productId: number, @Query('page',ParseIntPipe) page: number = 1, @Query('limit',ParseIntPipe) limit: number= 10){
    console.log('inside controller',productId)
    const details = await this.productService.getProducts(productId,page,limit)
    return details;
  }

  
  @ApiOperation({ summary: 'Get products by price range' })
  @Post('filters')
  async filterProductsByPrice(@Body() filterProduct: FilterProductDto) {
    const products = await this.productService.filterProductsByPrice(filterProduct);
    return { products };
  }
 
  
}
