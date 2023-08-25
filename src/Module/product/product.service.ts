// product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../admin/productCategory/entity/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async getProductById(productId: number): Promise<Product | undefined> {
    return this.productRepository.findOne({where:{productid:productId}});
  }

  async createProduct(createProductDto: CreateProductDto) {
    const { categoryId, ...productData } = createProductDto;
    // You can add validation for the categoryId here if needed

    // Create a new Product entity with the provided data
    const newProduct = this.productRepository.create({
      ...productData,
      category: { id: categoryId }, // Assign the Category entity using categoryId
    });

    // Save the new product in the database
    await this.productRepository.save(newProduct);
  }

  async getCategoryDetailsByParentId(parentId: number) {
    const details = await this.categoryRepository.find({
      where: { parentId },
    });
    return details;
  }

  async getProducts(productId:number)
  {
    console.log('inside service')
    const details = await this.productRepository.find({
        where: { category: { id: productId } },
    })
    console.log(details);
    return details;
  }

  

}
