// product.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../admin/productCategory/entity/category.entity';
import { Seller } from '../seller/entity/seller.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Category>
  ) {}

  async getProductById(productId: number): Promise<Product | undefined> {
    return this.productRepository.findOne({where:{productid:productId}});
  }

  async createProduct(createProductDto: CreateProductDto, sellerId) {
    console.log('inside service')
    // const seller = await this.sellerRepository.findOne(sellerId);
    // console.log(seller,'this line exe');
    const { categoryId, ...productData } = createProductDto;
    // You can add validation for the categoryId here if needed

    // Create a new Product entity with the provided data
    const newProduct = this.productRepository.create({
      ...productData,
      category: { id: categoryId }, // Assign the Category entity using categoryId
      
    });
    newProduct.seller = sellerId;
    console.log(newProduct)
    // Save the new product in the database
    await this.productRepository.save(newProduct);
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
    // console.log('inside service')
    // const details = await this.productRepository.find({
    //     where: { category: { id: productId } },
    // })
    // console.log(details);
    // return details;
  }

  

}
