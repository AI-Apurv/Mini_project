import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService){}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Request() req: any) {
      const userId = req.user.userId;
      console.log(userId,'userid--------------------')
      await this.orderService.createOrderForUser(userId);
      return { message: `Order created successfully.` };
    }
    
}
