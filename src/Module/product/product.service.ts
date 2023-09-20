import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../admin/productCategory/entity/category.entity';
import { Seller } from '../seller/entity/seller.entity';
import { Review } from './reviews/entity/review.entity';
import { FilterProductDto } from './dto/filterproduct.dto';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Category>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    // private readonly elasticsearchClient: Client
  ) {}

  // private readonly productIndexMapping = {
  //   mappings: {
  //     properties: {
  //       name: {
  //         type: 'text',
  //         analyzer: 'standard',
  //       },
  //       quantity: {
  //         type: 'integer',
  //       },
  //       price: {
  //         type: 'float',
  //       },
  //       image: {
  //         type: 'binary',
  //       },
  //       Rating: {
  //         type: 'float',
  //       },
  //       categoryId: {
  //         type: 'integer',
  //       },
  //       SellerId: {
  //         type: 'integer',
  //       },
  //       totalReview: {
  //         type: 'integer',
  //       },
  //     },
  //   },
  // }

  async getProductById(productId: number): Promise<Product | undefined> {
    return this.productRepository.findOne({where:{productid:productId}});
  }

  async getAllProducts() {
    const products = await this.productRepository.find();
    return products;
  }

  async createProduct(createProductDto: CreateProductDto, sellerId:number , imageBuffer:Buffer){
    console.log('inside service--------------------')
    const {name , quantity , price , categoryId} = createProductDto
    const product = new Product();
    product.name = name;
    product.quantity = quantity;
    product.price = price;
    product.category = {id: categoryId} as Category;
    product.image = imageBuffer;
    product.seller = {sellerid: sellerId} as Seller;
    console.log('before Image-----------', product)
    await this.productRepository.save(product);
    
  }

  async updateProduct(productId: number , updateProductDto, sellerId)
  {
    const product = await this.productRepository.findOne({
      where: {productid: productId , seller: sellerId},
      relations: ['seller']
    });
    console.log(product,'product----------')
    console.log(sellerId,'sellerid--------------')
    
    
    if(!product)
    {
      throw new NotFoundException('Product Not Found');
    }
    console.log(product.seller.sellerid,'product.seller')

    if (product.seller.sellerid !== sellerId) {
      throw new UnauthorizedException('You are not authorized to update this product');
    }

    const {name , quantity , price} = updateProductDto;
    product.name = name;
    product.quantity = quantity;
    product.price = price;

    return this.productRepository.save(product);
  }
  

  async getCategoryDetailsByParentId(parentId: number) {
    const details = await this.categoryRepository.find({
      where: { parentId },
    });
    return details;
  }

  async getProducts(productId:number, page:number, limit:number)
  {
    const [items, totalItems] = await this.productRepository.findAndCount({
      where: {category: {id: productId}},
      skip: (page-1)*limit,
      take: limit,
    });

    return {items, totalItems}
    
  }

  async filterProductsByPrice(filterProduct:FilterProductDto) {
    const products = await this.productRepository.find({
      where: {
        price: Between(filterProduct.minPrice, filterProduct.maxPrice),
      },
    });
    return products;
  }
  

}
