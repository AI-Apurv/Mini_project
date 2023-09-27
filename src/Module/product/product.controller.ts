import { Controller, Post, Body, UseGuards, Get, Param, Request, Patch, Query, ParseIntPipe, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard, JwtSellerAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseMessages } from 'src/common/responses/product.response';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UploadInterceptor } from 'src/interceptors/upload.interceptor';
import { SellerService } from '../seller/seller.service';
import { FilterProductDto } from './dto/filterproduct.dto';
import { RedisConfig } from 'src/providers/database/redis.connection';
import { ElasticsearchService } from '../elasticSearch/elasticsearch.service'; 


@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService,
    private readonly sellerService: SellerService,
    private readonly elasticsearchService: ElasticsearchService, 
    ) { }




  /**
* @author Apurv
* @description This function will return all the product list
*/
  @ApiOperation({ summary: 'Get all products' })
  @Get('all')
  async getAllProducts() {
    const key = 'getAllProduct';
    let getAllProduct = await RedisConfig.get(key);
    if (!getAllProduct) {
      const product = await this.productService.getAllProducts();
      await RedisConfig.set(key, product);
      getAllProduct = product;
    }
    return getAllProduct;
  }




  /**
* @author Apurv
* @description This function will used for adding products
* @Body CreateProductDto
* @payload name , quantity , price , image , categoryId
*/
  @ApiBearerAuth()
  @UseInterceptors(UploadInterceptor)
  @ApiOperation({ summary: 'Add products' })
  @UseGuards(JwtSellerAuthGuard)
  @Post('add')
  async createProduct(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    const image: Express.Multer.File = req.file;
    const imageBuffer: Buffer = image.buffer;
    const sellerId = req.user.userId;
    await this.productService.createProduct(createProductDto, sellerId, imageBuffer);
    return ProductResponseMessages.PRODUCT_CREATED 
  }




  /**
* @author Apurv
* @description This function will used for updating the product
* @Param productId
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the products' })
  @UseGuards(JwtAuthGuard)
  @Patch('update/:productId')
  async updateProduct(@Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto, @Request() req) {
    const updateProduct = await this.productService.updateProduct(productId, updateProductDto, req.user.userId);
    return updateProduct;
  }




  /**
* @author Apurv
* @description This function will used for getting product category
*/
  @ApiOperation({ summary: 'Get product category' })
  @Get()
  async getProductCategories() {
    const key = 'product_categories';
    let cachedCategories = await RedisConfig.get(key);

    if (!cachedCategories) {
      const categoriesWithCounts = [
        'Mens--1',
        'Women--2',
        'Kids--3'
      ];
      await RedisConfig.set(key, categoriesWithCounts, 86400);
      cachedCategories = categoriesWithCounts;

    }
    return cachedCategories;
  }




//   /**
// * @author Apurv
// * @description This function will return the product list of a given parent category 
// * @Param parentId
// */
//   @ApiOperation({ summary: 'Get Product details' })
//   @Get(':parentId')
//   async getCategoryDetails(@Param('parentId') parentId: number) {
//     const key = `product-parentId${parentId}`;
//     let cachedCategories = await RedisConfig.get(key);
//     if (!cachedCategories) {
//       const details = await this.productService.getCategoryDetailsByParentId(parentId);
//       await RedisConfig.set(key, details)
//       cachedCategories = details;
//     }
//     return cachedCategories;
//   }




  /**
* @author Apurv
* @description This function will used for getting a product details
* @Param productId
*/
  @ApiOperation({ summary: 'Get Product details' })
  @Get('product-details/:productId')
  async getProductDetails(@Param('productId') productId: number, @Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
    const details = await this.productService.getProducts(productId, page, limit)
    return details;
  }




  /**
* @author Apurv
* @description This function will used for filtering product based on price range
* @Body FilterProductDto
* @payload minPrice , maxPrice
*/
  @ApiOperation({ summary: 'Get products by price range' })
  @Post('filters')
  async filterProductsByPrice(@Body() filterProduct: FilterProductDto) {
    const products = await this.productService.filterProductsByPrice(filterProduct);
    return { products };
  }

  @Get('search')
  async searchProducts(@Query('query') query: string) {
    const products = await this.elasticsearchService.searchProducts(query);
    return products;
  }

}
