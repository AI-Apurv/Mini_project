import { Controller, Delete, Param,Get, Post, Request, UseGuards,UseInterceptors, InternalServerErrorException, Body, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as amqp from 'amqplib';
import { redis } from 'src/providers/database/redis.connection';
import { CreateOrderDto } from './dto/order.dto';
import { Address } from '../users/address/entity/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import Stripe from 'stripe'

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @ApiBearerAuth()
    @ApiOperation({summary: 'Get all the order details'})
    @Get('details')
    @UseGuards(JwtAuthGuard)
    async getOrderDetails(@Request() req: any){
      const userId = req.user.userId;
      const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: 'User has logged out. Please log in again.',
         };
      }
      return this.orderService.getOrderDetails(userId);
    }
   
    @ApiBearerAuth()
    @ApiOperation({summary:'Create an order'})
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Body() createdOrderDto: CreateOrderDto,@Request() req: any) {
      const userId = req.user.userId;
      const addressId = createdOrderDto.addressId;
      await this.orderService.validateAddressForUser(userId,addressId)
     const rabbitmqConn = await amqp.connect('amqp://localhost')
     const channel = await rabbitmqConn.createChannel();
     const createdOrders =  await this.orderService.createOrderForUser(userId, addressId);
     const queueName = 'booking-notifications';
      const message = JSON.stringify(createdOrders);
       await channel.assertQueue(queueName);            
       channel.sendToQueue(queueName, Buffer.from(message));
      return { message: `Order created successfully.`, orders: createdOrders };
    
  }
  
    @ApiBearerAuth()
    @ApiOperation({summary:'cancel the order'})
    @Delete(':orderId')
    @UseGuards(JwtAuthGuard)
    async cancelOrder(@Param('orderId') orderId: number,@Request() req:any){
      const userId = req.user.userId;
      const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: 'User has logged out. Please log in again.',
         };
      }
      return this.orderService.cancelOrder(orderId);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a list of canceled orders' })
    @Get('canceled-orders') 
    @UseGuards(JwtAuthGuard)
    async getCanceledOrders(@Request() req): Promise<Order[]>{
      const userId = req.user.userId;
      const canceledOrders = await this.orderService.getCanceledOrders(userId);
      return canceledOrders;
    }


    @Get('success')
    async success(@Request() req){
      // console.log(session.payment_status)
      const {sessionId} = req.query;
      // const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      console.log('inside the success',sessionId)
      return 'Payment successful. Thanks for purchasing';
    }

    @Get('cancel')
    async cancel(){
      return 'Payment cancelled !!';
    }
    
}
