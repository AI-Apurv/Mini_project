import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../users/cart/entity/cart.entity';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { Product } from '../product/entity/product.entity';
import { AddressService } from '../users/address/address.service';
import { Address } from '../users/address/entity/address.entity';
import { Statement } from './statements/entity/statement.entity';
import { Seller } from '../seller/entity/seller.entity';
import Stripe from 'stripe'
import { Orderstatus } from './order.model';

const stripe = require('stripe')('sk_test_51Npr7GSGOAo1m9gXjlZbeBpA3cxjvD9EDKgv1WkoXhED7EO83ZFgrmYVyhTAIzOBUKZdYXLMMbFJCHP55LMwNr5b00Se6zCj8K')

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Statement)
    private readonly statementRepository: Repository<Statement>,
  ) { }




  async validateAddressForUser(userId: number, addressId: number) {
    const address = await this.addressRepository.findOne({
      where: { addressId: addressId, user: userId },
    });
    if (!address) {
      throw new NotFoundException('Address not found for the user.');
    }
  }




  async getOrderDetails(userId: number) {
    return this.orderRepository.find({ where: { userId } })
  }




  async createOrderForUser(userId: number, addressId: number) {
    const cartItems = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.seller'],
    });
    if (!cartItems || cartItems.length === 0) {
      throw new NotFoundException('No items found in the cart.');
    }
    let totalAmount = 0;
    const orders = await Promise.all(cartItems.map(async cartItem => {
      totalAmount += cartItem.product.price * cartItem.quantity;
      const product = await this.productRepository.findOne({ where: { productid: cartItem.product.productid }, relations: ['seller'], })
      const seller_id = product.seller.sellerid
      const order = new Order();

      order.userId = userId;
      order.productId = cartItem.product.productid;
      order.quantity = cartItem.quantity;
      order.totalPrice = cartItem.product.price * cartItem.quantity;
      order.addressId = addressId
      order.sellerId = product.seller.sellerid
      order.orderStatus = Orderstatus.pending

      return order;
    })
    );

    const savedOrders = await this.orderRepository.save(orders);
    for (const order of savedOrders) {
      const product = await this.productRepository.findOne({ where: { productid: order.productId }, relations: ['seller'] });
      const sellerId = product.seller.sellerid
      if (product) {
        const statement = new Statement();
        statement.order = order.id;
        statement.creditId = sellerId;
        statement.debitId = userId;
        statement.amount = order.totalPrice;

        await this.statementRepository.save(statement);
      }
    }
    await this.orderRepository.save(orders);
    for (const cartItem of cartItems) {
      const product = cartItem.product;
      product.quantity -= cartItem.quantity;
      await this.productRepository.save(product);
    }
    await this.cartRepository.remove(cartItems);
    const totalOrderPrice = savedOrders.reduce((total, order) => total + order.totalPrice, 0);
    const ordersWithDetails = await Promise.all(
      savedOrders.map(async order => {
        const product = await this.productRepository.findOne({ where: { productid: order.productId } })
        return {
          ...order,
          productDetails: product,
        }
      })
    )
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Total amount',
            },
            unit_amount: totalOrderPrice * 100,

          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/orders/success?sessionId=${savedOrders[0].id}`,
      cancel_url: 'http://localhost:3000/orders/cancel'
    });
    const url = session.url;
    return { ordersWithDetails, totalOrderPrice, url };
  }




  async cancelOrder(orderId: number) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } })
    if (!order) {
      throw new NotFoundException('Order not found')
    }
    if (order.orderActive === false)
      return { message: 'You have already cancelled the order' }
    order.orderActive = false
    order.orderStatus = Orderstatus.cancelled;
    const product = order.productId;
    console.log(product);
    const pro = await this.productRepository.findOne({ where: { productid: product }, relations: ['seller'] })
    if (!pro) {
      throw new NotFoundException('Product not found')
    }
    const sellerId = pro.seller.sellerid;
    const statement = new Statement();
    statement.order = order.id;
    statement.creditId = order.userId
    statement.debitId = sellerId;
    statement.amount = order.totalPrice;
    await this.statementRepository.save(statement);
    pro.quantity += order.quantity;
    await this.productRepository.save(pro);
    await this.orderRepository.save(order)
    return { message: 'Order canceled successfully.' };
  }




  async getCanceledOrders(userId: number): Promise<Order[]> {
    try {
      const canceledOrders = await this.orderRepository.find({
        where: { userId, orderActive: false },
      });
      return canceledOrders;
    } catch (err) {
      throw err;
    }
  }




  async updateStatus(orderId: number) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    order.orderStatus = Orderstatus.placed
    await this.orderRepository.save(order);
  }




}
