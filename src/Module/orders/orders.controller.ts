import { Controller, Delete, Param,Get, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService){}


    @ApiOperation({summary: 'Get all the order details'})
    @Get('details')
    @UseGuards(JwtAuthGuard)
    async getOrderDetails(@Request() req: any){
      const userId = req.user.userId;
      return this.orderService.getOrderDetails(userId);
    }

    @ApiOperation({summary:'Create an order'})
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Request() req: any) {
      const userId = req.user.userId;
      console.log(userId,'userid--------------------')
     const createdOrders =  await this.orderService.createOrderForUser(userId);
      return { message: `Order created successfully.`, orders: createdOrders };
    }

    @ApiOperation({summary:'cancel the order'})
    @Delete(':orderId')
    @UseGuards(JwtAuthGuard)
    async cancelOrder(@Param('orderId') orderId: number){
      return this.orderService.cancelOrder(orderId);
    }
    
}
