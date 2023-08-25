// cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';
import { Product } from 'src/Module/product/entity/product.entity';


@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    console.log("inside add to cart service")
    const product = await this.productRepository.findOne({where:{productid:productId}})
    if(!product){
        throw new NotFoundException('Product not found');
    }
    console.log(product)

    if(product.quantity<quantity)
    {
        throw new NotFoundException("Insufficient product quantity")
    }

    let cartItem = await this.cartRepository.findOne({
        where:{
            user: {id:userId},
            product: {productid: productId}
        },
    });


    if(cartItem){
        cartItem.quantity += quantity;
    }
    else{
        cartItem = this.cartRepository.create({
            user: {id: userId},
            product: {productid:productId},
            quantity,
        })
    }
    console.log(cartItem)
    const totalPrice = product.price * cartItem.quantity;
    cartItem.price = totalPrice;
    await this.cartRepository.save(cartItem);

    

    // const cartItem = this.cartRepository.create({
    // //   userId,
    // //   productId,
    // //   quantity,
    // });

    // await this.cartRepository.save(cartItem);
  }

  async getCartDetailsForUser(userId: number): Promise<Cart[]> {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'], // Include the product relation
    });
  
    return cartItems;
  }
}