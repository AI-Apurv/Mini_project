import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../admin/productCategory/entity/category.entity';
import { Seller } from '../seller/entity/seller.entity';
import { Review } from './reviews/entity/review.entity';
import { FilterProductDto } from './dto/filterproduct.dto';

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
    private reviewRepository: Repository<Review>
  ) {}

  async getProductById(productId: number): Promise<Product | undefined> {
    return this.productRepository.findOne({where:{productid:productId}});
  }

  async getAllProducts() {
    const products = await this.productRepository.find();
    return products;
  }

  // async calculateAverageRating(productId: number):Promise<number>{
  //   const reviews = await this.reviewRepository.find({
  //     where: {productId},
  //     select: ['rating']
  //   });

  //   if(reviews.length === 0)
  //   {
  //     return 0 ;
  //   }
  //   const totalRating = reviews.reduce((acc,review)=> acc + review.rating,0);
  //   const averageRating = totalRating/reviews.length;
  //   return averageRating;
  // }

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
    // if(parentId !== 1  || parentId !== 2 || parentId!==3)
    // {
    //   throw new NotFoundException('Invalid parent Id')
    // }
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
