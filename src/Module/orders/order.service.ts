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
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
    ){}

    async createOrderForUser(userId: number) {
        const cartItems = await this.cartRepository.find({
          where: { user: { id: userId } },
          relations: ['product'],
        });
        console.log(cartItems,'----------cartItems----------')
        if (!cartItems || cartItems.length === 0) {
          throw new NotFoundException('No items found in the cart.');
        }
        
        let totalAmount = 0;
      
        const orders = cartItems.map(cartItem => {
          totalAmount += cartItem.product.price * cartItem.quantity;
      
          const order = new Order();
        //   order.user = userId;
          console.log(order.user,'-------order.user1------------')
          console.log(order.user,'-------order.user2------------')
          console.log(order.user,'-------order.user3------------')
        //   order.product = cartItem.product;
          order.totalPrice = cartItem.product.price * cartItem.quantity;
      
          return order;
        });
      
        await this.orderRepository.save(orders);

        for (const cartItem of cartItems) {
            const product = cartItem.product;
            product.quantity -= cartItem.quantity;
            await this.productRepository.save(product);
          }
        await this.cartRepository.remove(cartItems);
      
        return { message: `Order created successfully.Order details ${cartItems} and totalAmount ${totalAmount}`};
      }
      
}
