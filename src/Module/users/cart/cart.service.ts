// cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    // Check if the product exists
    // You can add more validation here, e.g., checking product availability
    // ...


    const cartItem = this.cartRepository.create({
    //   userId,
    //   productId,
    //   quantity,
    });

    await this.cartRepository.save(cartItem);
  }
}
