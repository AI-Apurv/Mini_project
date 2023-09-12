import { Post, Body, ValidationPipe, HttpException, HttpStatus, Controller, Delete, Patch, UseGuards, Request, HttpCode } from "@nestjs/common";
import { SignupDto } from "./dto/user-signup.dto";
import { LoginDto } from "./dto/user-login.dto";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { UpadteUserDto } from "./dto/update-user.dto";
import { ForgotPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { redis } from 'src/providers/database/redis.connection';
import {createClient} from 'redis';
import { userResponseMessages } from "src/common/responses/user.response";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserChangePasswordDto } from "./dto/change-password.dto";


const client = createClient()


@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,private readonly jwtService: JwtService) {}
  
    
    @ApiOperation({summary:'User Signup'})
    @Post('signup')
    async signup(@Body(new ValidationPipe({ transform: true })) signupDto: SignupDto): Promise<{ message: string }> {
      await this.userService.signup(signupDto);
      return { message: userResponseMessages.SIGNUP_SUCCESS };
    }
  
    @ApiBearerAuth()
    @ApiOperation({summary:'User Login'})
    @Post('login')
    async login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<{ accessToken: string }> {
      const user = await this.userService.validateUser(loginDto.email, loginDto.password);
  
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const payload = { sub: user.id, email: user.email, role: user.role};
      const accessToken = this.jwtService.sign(payload); 
      await client.connect();
      await client.set(user.id.toString(), 'true')
      return { accessToken };
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'Update user details'})
    @Patch('update-users')
    @UseGuards(JwtAuthGuard)
    async updateDetails(
      @Body(new ValidationPipe()) updateUserDto : UpadteUserDto,
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
        await this.userService.updateUserDetails(email, updateUserDto);
        return {message: userResponseMessages.UPDATE_SUCCESS}
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
          message: 'User has logged out. Please log in again.',
         };
      }
        await this.userService.deleteUser(email);
        return {message: userResponseMessages.DELETE_SUCCESS}
      } catch(error){
        throw new HttpException('Failed to delete user',HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'change user password'})
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Request() req, @Body(new ValidationPipe()) userchangePasswordDto: UserChangePasswordDto) {
    const userId = req.user.userId; 

    try {
      await this.userService.changePassword(userId, userchangePasswordDto);
      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      } else {
        throw new HttpException('Failed to update password', HttpStatus.INTERNAL_SERVER_ERROR);
      }    }
  }

    @ApiOperation({summary:'user forgot password'})
    @Post('forgot-password')
    async sendPasswordResetEmail(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
      await this.userService.sendPasswordResetEmail(forgotPasswordDto.email);
      return { message: userResponseMessages.FORGOT_PASSWORD_EMAIL_SENT };
    }

    @ApiOperation({summary:'Password reset email'})
    @Post('reset-password')
    @HttpCode(200)
    async resetPassword(@Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto): Promise<any> {
      
      try {
       
        const { email, otp, newPassword } = resetPasswordDto;
        const result = await this.userService.resetPassword(email, otp, newPassword);
        console.log(result)
        return {
          message: userResponseMessages.PASSWORD_RESET_SUCCESS,
          action: 'Please login: http://localhost:3000/userlogin',
        };
      } catch (error) {
        console.log(error);
        return {
          
          message: userResponseMessages.PASSWORD_RESET_FAILED,
          action: 'TRY AGAIN HERE: http://localhost:3000/forgotPassword',
        };
      }
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'User Logout'})
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req: any): Promise<{ message: string }> {
      try {
        const  userId  = (req.user.userId).toString();
        await redis.set(userId, 'false')
        return { message: userResponseMessages.LOGOUT_SUCCESS };
      } catch (error) {
        throw new HttpException('Failed to logout', HttpStatus.INTERNAL_SERVER_ERROR);
      }

 
    }
  
  }