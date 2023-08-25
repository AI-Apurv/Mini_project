// cart.controller.ts
import { Controller, Post, Body,Get, UseGuards, Request, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService,
              ) {}

  @Post('add-to-cart')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Body() addToCartDto: AddToCartDto, @Request() req: any) {
    const userId = req.user; 
    console.log('inside add-to-cart controller ')
    console.log(userId,'----------------');



    await this.cartService.addToCart(userId.userId, addToCartDto.productId, addToCartDto.quantity);
    return { message: 'Product added to cart successfully.' };
  }

  @Get('get-cart-details')
  @UseGuards(JwtAuthGuard)
  async getCartDetails(@Request() req: any) {
    console.log("inside cart controller")
    const userId = req.user.userId;
    console.log(userId);
    const cartDetails = await this.cartService.getCartDetailsForUser(userId);
    return cartDetails;
  }

}
