import { Controller, Post, Body,Get, UseGuards, Request, UnauthorizedException, NotFoundException, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartUpdateDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { redis } from 'src/providers/database/redis.connection';
@ApiTags('Carts')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth()
  @ApiOperation({summary:'Add item to cart'})            
  @Post('add-to-cart')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Body() addToCartDto: AddToCartDto, @Request() req: any) {
  const userId = req.user; 
  await this.cartService.addToCart(userId.userId, addToCartDto.productId, addToCartDto.quantity);
  return { message: 'Product added to cart successfully.' };
  }

  @ApiBearerAuth()
  @ApiOperation({summary:'Get cart details'})
  @Get('get-cart-details')
  @UseGuards(JwtAuthGuard)
  async getCartDetails(@Request() req: any) {
    const userId = req.user.userId;
    const sessionStatus = await redis.get(userId) 
    if (sessionStatus === 'false') {
      return {
        message: 'User has logged out. Please log in again.',
       };
    }
    const cartDetails = await this.cartService.getCartDetailsForUser(userId);
    return cartDetails;
  }

  @ApiBearerAuth()
  @ApiOperation({summary:'Update the cart items'})
  @Put('update-cart')
  @UseGuards(JwtAuthGuard)
  async updateCart(@Body() cartUpdateDto: CartUpdateDto, @Request() req: any) {
    const userId = req.user.userId;
    const sessionStatus = await redis.get(userId) 
    if (sessionStatus === 'false') {
      return {
        message: 'User has logged out. Please log in again.',
       };
    }
    await this.cartService.updateCart(userId, cartUpdateDto.productId, cartUpdateDto.quantity);
    return { message: 'Cart updated successfully.' };
  }

}
