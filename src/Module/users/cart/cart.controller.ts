// cart.controller.ts
import { Controller, Post, Body, UseGuards, Request, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductService } from 'src/Module/product/product.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService,
              ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Body() addToCartDto: AddToCartDto, @Request() req: any) {
    const userId = req.user.id; 

    // Validate userId, productId, and quantity
    // ...


    await this.cartService.addToCart(userId, addToCartDto.productId, addToCartDto.quantity);
    return { message: 'Product added to cart successfully.' };
  }
}
