import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async getOrderDetails(userId: number){
      return this.orderRepository.find({where:{userId , orderActive:true}})
    }

    async createOrderForUser(userId: number) {
        const cartItems = await this.cartRepository.find({
          where: { user: { id: userId } },
          relations: ['product'],
        });
        console.log('-------------userid inside service ------------',cartItems);
        if (!cartItems || cartItems.length === 0) {
          throw new NotFoundException('No items found in the cart.');
        }
        
        let totalAmount = 0;
        const orders = cartItems.map(cartItem => {
          totalAmount += cartItem.product.price * cartItem.quantity;
      
          const order = new Order();
          order.userId = userId;
          order.productId = cartItem.product.productid;
          order.quantity = cartItem.quantity;
          order.totalPrice = cartItem.product.price * cartItem.quantity;
      
          return order;
        });

        const savedOrders = await this.orderRepository.save(orders);

        console.log('----------------orders----------------', orders)

  
        await this.orderRepository.save(orders);

        for (const cartItem of cartItems) {
            const product = cartItem.product;
            product.quantity -= cartItem.quantity;
            await this.productRepository.save(product);

            console.log('-----------------products-----------------', product)

          }

          
        await this.cartRepository.remove(cartItems);
      
        // return savedOrders;
        const totalOrderPrice = savedOrders.reduce((total, order) => total + order.totalPrice, 0);

        const ordersWithDetails = await Promise.all(
          savedOrders.map(async order => {
            const product = await this.productRepository.findOne({where:{productid:order.productId}})
            return {
              ...order,
              productDetails: product,
            }
          })
        )
        return {ordersWithDetails,totalOrderPrice};
      }

      async cancelOrder(orderId:number){
        const order = await this.orderRepository.findOne({where:{id:orderId}})

        if(!order){
          throw new NotFoundException('Order not found')
        }

        if(!order.orderActive){
          throw new BadRequestException('cannot cancel the order. Order delievered already');
        }

        const product = order.productId;
        console.log(product);
        const pro = await this.productRepository.findOne({where:{productid:product}})
        pro.quantity += order.quantity;
        await this.productRepository.save(pro);

        // Remove the order
        await this.orderRepository.remove(order);

        return { message: 'Order canceled successfully.' };

      }
      
}
