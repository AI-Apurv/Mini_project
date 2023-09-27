import { Controller, Delete, Res, Param, Get, Post, Request, UseGuards, UseInterceptors, InternalServerErrorException, Body, NotFoundException } from '@nestjs/common';
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
import { ORDERRESPONSE, orderResponseMessages } from 'src/common/responses/order.response';
import { httpResponse } from 'src/Middleware/httpResponse';
import { Response, response } from 'express';
@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService,
              private readonly httpResponse: httpResponse) { }




  /**
* @author Apurv
* @description This function will used for getting order details
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all the order details' })
  @Get('details')
  @UseGuards(JwtAuthGuard)
  async getOrderDetails(@Request() req: any) {
    const userId = req.user.userId;
    return this.orderService.getOrderDetails(userId);
  }




  /**
 * @author Apurv
 * @description This function will used for placing an order
 * @Body CreateOrderDto
 * @payload addressId
 */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an order' })
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() createdOrderDto: CreateOrderDto, @Request() req: any, @Res() response: Response) {
    const userId = req.user.userId;
    const addressId = createdOrderDto.addressId;
    await this.orderService.validateAddressForUser(userId, addressId)
    const rabbitmqConn = await amqp.connect('amqp://localhost')
    const channel = await rabbitmqConn.createChannel();
    const createdOrders = await this.orderService.createOrderForUser(userId, addressId);
    const queueName = 'booking-notifications';
    const message = JSON.stringify(createdOrders);
    await channel.assertQueue(queueName);
    channel.sendToQueue(queueName, Buffer.from(message));
    return this.httpResponse.sendResponse(response, ORDERRESPONSE.ORDER_CREATED, createdOrders)
  }




  /**
* @author Apurv
* @description This function will used for cancelling an order
* @Param orderId
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'cancel the order' })
  @Delete(':orderId')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(@Param('orderId') orderId: number, @Request() req: any) {
    return this.orderService.cancelOrder(orderId);
  }




  /**
* @author Apurv
* @description This function will used for getting a list of cancelled order
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a list of canceled orders' })
  @Get('canceled-orders')
  @UseGuards(JwtAuthGuard)
  async getCanceledOrders(@Request() req, @Res() response: Response) {
    const userId = req.user.userId;
    const canceledOrders = await this.orderService.getCanceledOrders(userId);
    return this.httpResponse.sendResponse(response, ORDERRESPONSE.CANCELLED_ORDER, canceledOrders);
  }




  /**
  * @author Apurv
  * @description This function will used for updating the order status when payment is done
  */
  @Get('success')
  async success(@Request() req, @Res() response: Response) {
    const { sessionId } = req.query;
    await this.orderService.updateStatus(sessionId)
    return this.httpResponse.sendResponse(response, ORDERRESPONSE.PAYMENT_SUCCESS);
  }




  /**
* @author Apurv
* @description This function will be called when payment is cancelled
*/
  @Get('cancel')
  async cancel(@Res() response: Response) {
    return this.httpResponse.sendResponse(response, ORDERRESPONSE.PAYMENT_CANCEL);
  }




}
