import { Post, Body, ValidationPipe, HttpException, HttpStatus, Controller, Delete, Patch, UseGuards, Request, HttpCode } from "@nestjs/common";
import { SignupDto } from "./dto/user-signup.dto";
import { LoginDto } from "./dto/user-login.dto";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { UpadteUserDto } from "./dto/update-user.dto";
import { ForgotPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { redis, getClient } from 'src/providers/database/redis.connection';
import {createClient} from 'redis';
import Redis from 'ioredis';

const client = createClient()
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService,
                ) {}
  

    @Post('signup')
    async signup(@Body(new ValidationPipe({ transform: true })) signupDto: SignupDto): Promise<{ message: string }> {
      await this.userService.signup(signupDto);
      return { message: 'User registered successfully' };
    }
  
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

    @Patch('update-users')
    @UseGuards(JwtAuthGuard)
    async updateDetails(
      @Body(new ValidationPipe()) updateUserDto : UpadteUserDto,
      @Request() req: any
    ): Promise<{message: string}>{
      try{
        const {email} = req.user;
        await this.userService.updateUserDetails(email, updateUserDto);
        return {message: 'User details updated successfully'}
      }catch(error){
        throw new HttpException('Failed to update user details', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  
    @Delete('delete-user')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Request() req: any): Promise<{message: string}>{
      try{
        const {email} = req.user;
        await this.userService.deleteUser(email);
        return {message: 'User deleted successfully'}
      } catch(error){
        throw new HttpException('Failed to delete user',HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Post('forgot-password')
    async sendPasswordResetEmail(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
      await this.userService.sendPasswordResetEmail(forgotPasswordDto.email);
      return { message: 'Password reset OTP sent to email' };
    }

    @Post('reset-password')
    @HttpCode(200)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
      
      try {
       
        const { email, otp, newPassword } = resetPasswordDto;
        const result = await this.userService.resetPassword(email, otp, newPassword);
        console.log(result)
        return {
          message: result,
          action: 'Please login: http://localhost:3000/userlogin',
        };
      } catch (error) {
        console.log(error);
        return {
          
          message: 'Password reset failed',
          action: 'TRY AGAIN HERE: http://localhost:3000/forgotPassword',
        };
      }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req: any): Promise<{ message: string }> {
      try {
        const { userId } = req.user;
        console.log(userId);
       
        await client.connect();

        const sessionBefore = await client.get(userId);
        console.log("Session value before database query:", sessionBefore);

        

        await client.set(userId, 'false')
        console.log("bye")
        // Find the user's active session
        console.log(client.get(userId))
        const session = await this.userService.getActiveSession(userId);
        console.log(session,"-----------------------")
        if (session) {
          // Set isActive to false for the active session
          await this.userService.updateSession(session, false);
        }
        return { message: 'Logged out successfully' };
      } catch (error) {
        throw new HttpException('Failed to logout', HttpStatus.INTERNAL_SERVER_ERROR);
      }

 
    }

    



  
  }