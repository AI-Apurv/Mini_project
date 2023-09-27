import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../admin/productCategory/entity/category.entity';
import { Seller } from '../seller/entity/seller.entity';
import { Review } from './reviews/entity/review.entity';
import { FilterProductDto } from './dto/filterproduct.dto';
import { ElasticsearchService } from '../elasticSearch/elasticsearch.service'; // Import the Elasticsearch service


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
    private readonly elasticsearchService: ElasticsearchService, 
  ) { }


  async getProductById(productId: number) {
    return this.productRepository.findOne({ where: { productid: productId } });
  }




  async getAllProducts() {
    const products = await this.productRepository.find();
    return products;
  }




  async createProduct(createProductDto: CreateProductDto, sellerId: number, imageBuffer: Buffer) {
    const { name, quantity, price, categoryId } = createProductDto
    const product = new Product();
    product.name = name;
    product.quantity = quantity;
    product.price = price;
    product.category = { id: categoryId } as Category;
    product.image = imageBuffer;
    product.seller = { sellerid: sellerId } as Seller;
    await this.productRepository.save(product);
    await this.elasticsearchService.indexProduct({
      productid: product.productid,
      name: product.name,
      price: product.price,
      rating: product.Rating,
      totalReview: product.totalReview
    });
  }




  async updateProduct(productId: number, updateProductDto, sellerId) {
    const product = await this.productRepository.findOne({
      where: { productid: productId, seller: sellerId },
      relations: ['seller']
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    if (product.seller.sellerid !== sellerId) {
      throw new UnauthorizedException('You are not authorized to update this product');
    }
    const { name, quantity, price } = updateProductDto;
    product.name = name;
    product.quantity = quantity;
    product.price = price;
    await this.elasticsearchService.indexProduct({
      productid: product.productid,
      name: product.name,
      price: product.price,
      rating: product.Rating,
      totalReview: product.totalReview
    });
    return this.productRepository.save(product);
  }




  // async getCategoryDetailsByParentId(parentId: number) {
  //   const details = await this.categoryRepository.find({
  //     where: { parentId },
  //   });
  //   return details;
  // }




  async getProducts(productId: number, page: number, limit: number) {
    const [items, totalItems] = await this.productRepository.findAndCount({
      where: { category: { id: productId } },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, totalItems }
  }




  async filterProductsByPrice(filterProduct: FilterProductDto) {
    const products = await this.productRepository.find({
      where: {
        price: Between(filterProduct.minPrice, filterProduct.maxPrice),
      },
    });
    return products;
  }

 
}
