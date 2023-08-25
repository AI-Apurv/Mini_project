// seller.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerSignupDto } from './dto/seller-signup.dto';
import { SellerLoginDto } from './dto/seller-login.dto';

@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('signup')
  async signup(@Body() signupDto: SellerSignupDto) {
    await this.sellerService.signup(signupDto);
    return { message: 'Signup successful.' };
  }

  @Post('login')
  async login(@Body() loginDto: SellerLoginDto) {
    const token = await this.sellerService.login(loginDto);
    return { token };
  }

}
