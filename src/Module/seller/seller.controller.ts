import { Controller, Post, Body, Patch, UseGuards, ValidationPipe, Request, HttpException, HttpStatus, Delete, HttpCode, Get, Param } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerSignupDto } from './dto/seller-signup.dto';
import { SellerLoginDto } from './dto/seller-login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { redis } from 'src/providers/database/redis.connection';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { sellerResponseMessage } from 'src/common/responses/seller.response';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SellerChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Sellers')
@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @ApiBearerAuth()
  @ApiOperation({summary:'Seller signup'})
  @Post('signup')
  async signup(@Body() signupDto: SellerSignupDto) {
    await this.sellerService.signup(signupDto);
    return { message: 'Signup successful.' };
  }

  @ApiBearerAuth()
  @ApiOperation({summary:'Seller login'})
  @Post('login')
  async login(@Body() loginDto: SellerLoginDto) {
    const token = await this.sellerService.login(loginDto);
    return { token };
  }

    @ApiBearerAuth()
    @ApiOperation({summary:'Update seller details'})
    @Patch('update-sellers')
    @UseGuards(JwtAuthGuard)
    async updateDetails(
      @Body(new ValidationPipe()) updateSellerDto : UpdateSellerDto,
      @Request() req: any
    ): Promise<{message: string}>{
      try{
        const {email, userId} = req.user;
        const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: 'Seller has logged out. Please log in again.',
         };
      }
        await this.sellerService.updateSellerDetails(email, updateSellerDto);
        return {message: sellerResponseMessage.UPDATE_SUCCESS}
      }catch(error){
        throw new HttpException('Failed to update user details', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  
    @ApiBearerAuth()
    @ApiOperation({summary:'Delete user'})
    @Delete('delete-user')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Request() req: any): Promise<{message: string}>{
      try{
        const {email, userId} = req.user;
        const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: 'Seller has logged out. Please log in again.',
         };
      }
        await this.sellerService.deleteUser(email);
        return {message: sellerResponseMessage.DELETE_SUCCESS}
      } catch(error){
        throw new HttpException('Failed to delete user',HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @ApiOperation({summary:'seller forgot password'})
    @Post('forgot-password')
    async sendPasswordResetEmail(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
      await this.sellerService.sendPasswordResetEmail(forgotPasswordDto.email);
      return { message: sellerResponseMessage.FORGOT_PASSWORD_EMAIL_SENT };
    }

    @ApiOperation({summary:'Password reset email'})
    @Post('reset-password')
    @HttpCode(200)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
      
      try {
       
        const { email, otp, newPassword } = resetPasswordDto;
        const result = await this.sellerService.resetPassword(email, otp, newPassword);
        console.log(result)
        return {
          message: sellerResponseMessage.PASSWORD_RESET_SUCCESS,
          action: 'Please login: http://localhost:3000/userlogin',
        };
      } catch (error) {
        console.log(error);
        return {
          
          message: sellerResponseMessage.PASSWORD_RESET_FAILED,
          action: 'TRY AGAIN HERE: http://localhost:3000/forgotPassword',
        };
      }
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'change seller password'})
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Request() req, @Body() sellerchangePasswordDto: SellerChangePasswordDto) {
    const userId = req.user.userId; 

    try {
      await this.sellerService.changePassword(userId, sellerchangePasswordDto);
      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new Error('Failed to update password');
    }
  }


    @ApiBearerAuth()
    @ApiOperation({summary:'Seller Logout'})
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req: any): Promise<{ message: string }> {
      try {
        const  userId  = (req.user.userId).toString();
        await redis.set(userId, 'false')
        return { message: sellerResponseMessage.LOGOUT_SUCCESS };
      } catch (error) {
        throw new HttpException('Failed to logout', HttpStatus.INTERNAL_SERVER_ERROR);
      }

 
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get products ordered list from the seller' })
    @Get('sold-products')
    @UseGuards(JwtAuthGuard)
  async getSoldProducts(@Request() req: any): Promise<any[]> {
    const userId = req.user.userId;

    try {
      
      const soldProducts = await this.sellerService.getSoldProducts(userId);

      return soldProducts;
    } catch (error) {
      throw new HttpException('Failed to fetch sold products', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



//-----------------------------------------------------------------------------------------//

  


}
