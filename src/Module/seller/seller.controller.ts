import { Controller, Post, Body, Res, Patch, UseGuards, ValidationPipe, Request, HttpException, HttpStatus, Delete, HttpCode, Get, Param } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerSignupDto } from './dto/seller-signup.dto';
import { SellerLoginDto } from './dto/seller-login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, JwtSellerAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { redis } from 'src/providers/database/redis.connection';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SELLERRESPONSE, sellerResponseMessage } from 'src/common/responses/seller.response';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SellerChangePasswordDto } from './dto/change-password.dto';
import { httpResponse } from 'src/Middleware/httpResponse';
import { Response, response } from 'express';
import { createClient } from 'redis';
const client =  createClient()
client.connect();

@ApiTags('Sellers')
@Controller('sellers')
export class SellerController {
  constructor(private readonly sellerService: SellerService,
    private readonly httpResponse: httpResponse) { }




  /**
* @author Apurv
* @description This function will used for seller signup
* @Body SellerSignupDto
* @payload name , email , password , contact number
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller signup' })
  @Post('signup')
  async signup(@Body() signupDto: SellerSignupDto, @Res() response: Response) {
    await this.sellerService.signup(signupDto);
    return this.httpResponse.sendResponse(response, SELLERRESPONSE.SIGNUP_SUCCESS)
  }




  /**
* @author Apurv
* @description This function will used for seller login
* @Body SellerLoginDto
* @payload email , password
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller login' })
  @Post('login')
  async login(@Body() loginDto: SellerLoginDto, @Res() response: Response) {
    const seller = await this.sellerService.login(loginDto);
    await client.set(`${seller.seller.email}${seller.seller.sellerid}`,'true')
    return this.httpResponse.sendResponse(response, SELLERRESPONSE.LOGIN_SUCCESS, seller.token);
  }




  /**
* @author Apurv
* @description This function will used for adding new address
* @Body UpdateSellerDto
* @payload name , email , contact number 
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seller details' })
  @Patch('update-sellers')
  @UseGuards(JwtSellerAuthGuard)
  async updateDetails(
    @Body(new ValidationPipe()) updateSellerDto: UpdateSellerDto, @Res() response: Response,
    @Request() req: any) {
    try {
      const { email } = req.user;
      await this.sellerService.updateSellerDetails(email, updateSellerDto);
      return this.httpResponse.sendResponse(response, SELLERRESPONSE.UPDATE_SUCCESS)
    } catch (error) {
      throw new HttpException(sellerResponseMessage.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }




  /**
* @author Apurv
* @description This function will used for delete seller 
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @Delete('delete-user')
  @UseGuards(JwtSellerAuthGuard)
  async deleteUser(@Request() req: any, @Res() response: Response) {
    try {
      const { email } = req.user;
      await this.sellerService.deleteUser(email);
      return this.httpResponse.sendResponse(response, SELLERRESPONSE.DELETE_SUCCESS)
    } catch (error) {
      throw new HttpException(sellerResponseMessage.DELETE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




  /**
* @author Apurv
* @description This function will used for sending forgot password email
* @Body ForgotPAsswordDto
* @payload email 
*/
  @ApiOperation({ summary: 'seller forgot password' })
  @Post('forgot-password')
  async sendPasswordResetEmail(@Body() forgotPasswordDto: ForgotPasswordDto, @Res() response: Response) {
    await this.sellerService.sendPasswordResetEmail(forgotPasswordDto.email);
    return this.httpResponse.sendResponse(response, SELLERRESPONSE.FORGOT_PASSWORD_EMAIL_SENT);
  }




  /**
* @author Apurv
* @description This function will used for reset password
* @Body ResetPasswordDto
* @payload email , otp , newPassword 
*/
  @ApiOperation({ summary: 'Password reset email' })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() response: Response) {
    try {
      const { email, otp, newPassword } = resetPasswordDto;
      const result = await this.sellerService.resetPassword(email, otp, newPassword);
      return this.httpResponse.sendResponse(response, SELLERRESPONSE.PASSWORD_RESET_SUCCESS)
    } catch (error) {
      return this.httpResponse.sendResponse(response, SELLERRESPONSE.PASSWORD_RESET_FAILED)
    }
  }




  /**
* @author Apurv
* @description This function will used for changing password
* @Body SellerChangePasswordDto
* @payload old Password , NewPassword 
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'change seller password' })
  @UseGuards(JwtSellerAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() sellerchangePasswordDto: SellerChangePasswordDto, @Res() response: Response) {
    const userId = req.user.userId;
    try {
      await this.sellerService.changePassword(userId, sellerchangePasswordDto);
      return this.httpResponse.sendResponse(response, SELLERRESPONSE.PASSWORD_UPDATE)
    } catch (error) {
      throw new Error(sellerResponseMessage.PASSWORD_CHANGE_FAILED);
    }
  }





  /**
* @author Apurv
* @description This function will used for seller logout
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seller Logout' })
  @Post('logout')
  @UseGuards(JwtSellerAuthGuard)
  async logout(@Request() req: any, @Res() response: Response) {
    try {
      await redis.set(`${req.user.email}${req.user.sellerId}`, 'false')
      return this.httpResponse.sendResponse(response, SELLERRESPONSE.LOGOUT_SUCCESS)
    } catch (error) {
      throw new HttpException(sellerResponseMessage.FAILED_LOGOUT, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




  /**
* @author Apurv
* @description This function will give list of sold products
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get products ordered list from the seller' })
  @Get('sold-products')
  @UseGuards(JwtSellerAuthGuard)
  async getSoldProducts(@Request() req: any, @Res() response: Response) {
    const userId = req.user.userId;
    try {
      const soldProducts = await this.sellerService.getSoldProducts(userId);
      return this.httpResponse.sendResponse(response, SELLERRESPONSE.LIST, soldProducts)
    } catch (error) {
      throw new HttpException(sellerResponseMessage.FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




}
