import { Controller, Get, Res, Post, Body, Param, Put, Delete, Request, ValidationPipe, HttpException, HttpStatus, NotFoundException, UseGuards, UnauthorizedException, Patch } from '@nestjs/common';
import { DeliveryBoyService } from './del.service';
import { DeliveryBoy } from './entity/del.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard, JwtDeliveryBoyAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { DBLoginDto } from './dto/login.dto';
import { DBSignupDto } from './dto/create.dto';
import { ConfirmOTP } from './dto/confirm-otp.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DELIVERYBOYRESPONSE, deliveryBoyResponseMessage } from 'src/common/responses/deliveryBoy.response';
import { createClient } from 'redis';
import { redis } from 'src/providers/database/redis.connection';
import { UpdateDto } from './dto/update.dto';
import { httpResponse } from 'src/Middleware/httpResponse';
import { Response } from 'express';
const client = createClient()




@ApiTags('Delievery Boy')
@Controller('delivery-boys')
export class DeliveryBoyController {
  constructor(private readonly deliveryBoyService: DeliveryBoyService, private readonly jwtService: JwtService, private readonly httpResponse: httpResponse) { }




  /**
* @author Apurv
* @description This function will used for delivery boy signup
* @Body DBSignupDto
* @payload name , email , password
*/
  @ApiOperation({ summary: 'delievery boy signup' })
  @Post('signup')
  async signup(@Body(new ValidationPipe({ transform: true })) signupDto: DBSignupDto, @Res() response: Response) {
    await this.deliveryBoyService.signup(signupDto);
    return this.httpResponse.sendResponse(response, DELIVERYBOYRESPONSE.SUCCESS);
  }




  /**
* @author Apurv
* @description This function will used for delivery boy login
* @Body DBLoginDto
* @payload email , password
*/
  @ApiOperation({ summary: 'delievery boy login' })
  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: DBLoginDto, @Res() response: Response) {
    const user = await this.deliveryBoyService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new HttpException(deliveryBoyResponseMessage.INVALID, HttpStatus.UNAUTHORIZED);
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return this.httpResponse.sendResponse(response, DELIVERYBOYRESPONSE.LOGIN, accessToken);
  }





  /**
* @author Apurv
* @description This function will used for delivery boy signup
* @Body UpdateDto
* @payload name , email 
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update delivery boy details' })
  @Patch('update')
  @UseGuards(JwtDeliveryBoyAuthGuard)
  async updateDetails(@Body(new ValidationPipe()) updateDelDto: UpdateDto, @Request() req: any, @Res() response: Response) {
    try {
      const { email, userId } = req.user;
      const sessionStatus = await redis.get(userId.toString());
      if (sessionStatus === 'false') {
        return deliveryBoyResponseMessage.SESSIONSTATUS
      }
      await this.deliveryBoyService.updateUserDetails(email, updateDelDto);
      return this.httpResponse.sendResponse(response, DELIVERYBOYRESPONSE.UPDATE)
    } catch (error) {
      throw new HttpException(deliveryBoyResponseMessage.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }




  /**
* @author Apurv
* @description This function will used for sending otp to user's email who has placed the order
* @Param orderId
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'sent otp to registered email' })
  @UseGuards(JwtDeliveryBoyAuthGuard)
  @Post('confirm-delivery/:orderId')
  async confirmDeliveryotp(@Param('orderId') orderId: number, @Request() req, @Res() response: Response) {
    const order = await this.deliveryBoyService.confirmDeliveryOtp(orderId);
    return this.httpResponse.sendResponse(response, DELIVERYBOYRESPONSE.OTP_SENT)
  }




  /**
* @author Apurv
* @description This function will used for confirming that order delievered successfully
* @Param orderId
*/
  @ApiOperation({ summary: 'order delievered successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtDeliveryBoyAuthGuard)
  @Put('confirm-delivery/OTP/:orderId')
  async confirmDelivery(@Param('orderId') orderId: number, @Body() confirmOtp: ConfirmOTP, @Request() req: any, @Res() response: Response) {
    const order = await this.deliveryBoyService.confirmDelivery(orderId, confirmOtp.otp);
    return this.httpResponse.sendResponse(response, DELIVERYBOYRESPONSE.ORDER_SUCCESS, order)
  }




}
