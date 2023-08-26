import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../users/cart/entity/cart.entity';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { Product } from '../product/entity/product.entity';

@Injectable()
export class OrderService {
    constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    ){}

    async createOrderForUser(userId: number) {
        const cartItems = await this.cartRepository.find({
          where: { user: { id: userId } },
          relations: ['product'],
        });
      
        if (!cartItems || cartItems.length === 0) {
          throw new NotFoundException('No items found in the cart.');
        }
      
        let totalAmount = 0;
      
        const orders = cartItems.map(cartItem => {
          totalAmount += cartItem.product.price * cartItem.quantity;
      
          const order = new Order();
          order.user = cartItem.user;
          console.log(order.user)
        //   order.product = cartItem.product;
          order.totalPrice = cartItem.product.price * cartItem.quantity;
      
          return order;
        });
      
        await this.orderRepository.save(orders);
        await this.cartRepository.remove(cartItems);
      
        return { message: 'Order created successfully.', totalAmount };
      }
      
}
