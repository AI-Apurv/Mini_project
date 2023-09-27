import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const product = await this.productRepository.findOne({where:{productid:productId}})
    if(!product){
        throw new NotFoundException('Product not found');
    }

    if(product.quantity<quantity)
    {
        throw new NotFoundException("Insufficient product quantity")
    }

    let cartItem = await this.cartRepository.findOne({
        where:{
            user: {id:userId},
            product: {productid: productId}
        },
        // relations: ['products'] // new change
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
    const totalPrice = product.price * cartItem.quantity;
    cartItem.price = totalPrice;
    await this.cartRepository.save(cartItem);
    return product;
  }

  async getCartDetailsForUser(userId: number): Promise<Cart[]> {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'], 
    });
  
    return cartItems;
  }

  async updateCart(userId: number, productId: number, quantity: number) {
    const product = await this.productRepository.findOne({ where: { productid: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (quantity <= 0) {
      // Remove cart item if quantity becomes 0 or negative
      await this.cartRepository.delete({ user: { id: userId }, product: { productid: productId } });
      return;
    }

    if (product.quantity < quantity) {
      throw new BadRequestException("Insufficient product quantity");
    }

    const cartItem = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        product: { productid: productId },
      },
    });

    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      throw new NotFoundException("Cart item not found");
    }

    const totalPrice = product.price * cartItem.quantity;
    cartItem.price = totalPrice;

    await this.cartRepository.save(cartItem);
  }

}