import { Controller, Get, Post, Body, Param, Put, Delete,Request, ValidationPipe, HttpException, HttpStatus, NotFoundException, UseGuards, UnauthorizedException, Patch } from '@nestjs/common';
import { DeliveryBoyService } from './del.service';
import { DeliveryBoy } from './entity/del.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { DBLoginDto } from './dto/login.dto';
import { DBSignupDto } from './dto/create.dto';
import { ConfirmOTP } from './dto/confirm-otp.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { delBoyResponseMessage } from 'src/common/responses/del-boy.response';
import { createClient } from 'redis';
import { redis } from 'src/providers/database/redis.connection';
import { UpdateDto } from './dto/update.dto';

const client = createClient()
@ApiTags('Delievery Boy')
@Controller('delivery-boys')
export class DeliveryBoyController {
  constructor(private readonly deliveryBoyService: DeliveryBoyService,private readonly jwtService: JwtService) {}

  @ApiOperation({summary: 'delievery boy signup'})
  @Post('signup')
  async signup(@Body(new ValidationPipe({ transform: true })) signupDto: DBSignupDto): Promise<{ message: string }> {
    await this.deliveryBoyService.signup(signupDto);
    return { message: delBoyResponseMessage.SIGNUP_SUCCESS};
    }

    @ApiOperation({summary: 'delievery boy login'})
    @Post('login')
    async login(@Body(new ValidationPipe()) loginDto: DBLoginDto): Promise<{ accessToken: string }> {
      const user = await this.deliveryBoyService.validateUser(loginDto.email, loginDto.password);
  
      if (!user) {
        throw new HttpException(delBoyResponseMessage.INVALID, HttpStatus.UNAUTHORIZED);
      }
      const payload = { sub: user.id, email: user.email, role: user.role};
      const accessToken = this.jwtService.sign(payload); 
      console.log(accessToken)
      return { accessToken };
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'Update delivery boy details'})
    @Patch('update')
    @UseGuards(JwtAuthGuard)
    async updateDetails(
      @Body(new ValidationPipe()) updateDelDto : UpdateDto,
      @Request() req: any
    ): Promise<{message: string}>{
      try{
        const {email, userId} = req.user;
        const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: 'User has logged out. Please log in again.',
         };
      }
        await this.deliveryBoyService.updateUserDetails(email, updateDelDto);
        return {message: 'deails updated successfully'}
      }catch(error){
        throw new HttpException('Failed to update seller details', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }


    @ApiBearerAuth()
    @ApiOperation({summary: 'sent otp to registered email'})
    @UseGuards(JwtAuthGuard)
    @Post('confirm-delivery/:orderId')
    async confirmDeliveryotp(@Param('orderId') orderId: number, @Request() req): Promise<{ message: string }> {
    const role = req.user.role
    if(role!=='dboy')
    {
      throw new UnauthorizedException(delBoyResponseMessage.AUTHORIZE_FAILED)
    }
    const order = await this.deliveryBoyService.confirmDeliveryOtp(orderId);
    //  if (!order) {
    // throw new NotFoundException('Order not found');
    // }

    return { message: delBoyResponseMessage.OTP_SENT };
}
      @ApiOperation({summary: 'order delievered successfully'})
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard)
      @Put('confirm-delivery/OTP/:orderId')
      async confirmDelivery(@Param('orderId') orderId: number, @Body() confirmOtp:ConfirmOTP ,  @Request() req): Promise<{ message: string }> {
      const role = req.user.role
      if(role!=='dboy')
      {
        throw new UnauthorizedException(delBoyResponseMessage.AUTHORIZE_FAILED)
      }
      const order = await this.deliveryBoyService.confirmDelivery(orderId, confirmOtp.otp);
      return { message: delBoyResponseMessage.ORDER_SUCCESS };
      }
}
