import { Body, Controller, Patch,Delete, Post,Get, UseGuards, ValidationPipe,Request, Param, HttpException, HttpCode, HttpStatus} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { AdminUpdateDto } from "./dto/admin-update.dto";
import { AdminResponseMessages } from "src/common/responses/admin.response";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { redis } from "src/providers/database/redis.connection";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AdminChangePasswordDto } from "./dto/change-password.dto";

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

   
    async createAdmin() {
      await this.adminService.createAdmin();
      return { message: AdminResponseMessages.ADMIN_CREATED };
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'Admin Login'})
    @Post('login')
    async login(@Body() loginDto: AdminLoginDto) {
      const token = await this.adminService.login(loginDto);
      return { token };
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'update admin details'})
    @Patch('update')
    @UseGuards(JwtAuthGuard) 
    async updateAdmin(@Body(new ValidationPipe()) updateDto: AdminUpdateDto,  @Request() req: any) {
      const adminId = req.user.userId ;
      const role = req.user.role;
      const sessionStatus = await redis.get(adminId.toString());

        if (sessionStatus === 'false') {
        return {
          message: AdminResponseMessages.SESSION_STATUS,
         };
      }
      await this.adminService.updateAdmin(updateDto,adminId,role);
      return { message: AdminResponseMessages.UPDATE_SUCCESS };
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'Verify the Sellers'})
    @Post(':sellerid/verify')
    @UseGuards(JwtAuthGuard)
    async verifySeller(@Param('sellerid') sellerid: number, @Request() req:any) {
      const admin = req.user;
      await this.adminService.verifySeller(sellerid,admin.role);
      return { message: AdminResponseMessages.VERIFY_SELLER_SUCCESS };
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'Delete admin'})
    @Delete('delete-admin')
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Request() req: any): Promise<{message: string}>{
      try{
        const {email, userId} = req.user;
        const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: AdminResponseMessages.SESSION_STATUS,
         };
      }
        await this.adminService.deleteUser(email);
        return {message: AdminResponseMessages.DELETE_SUCCESS}
      } catch(error){
        throw new HttpException('Failed to delete admin',HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @ApiOperation({summary:'admin forgot password'})
    @Post('forgot-password')
    async sendPasswordResetEmail(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
      await this.adminService.sendPasswordResetEmail(forgotPasswordDto.email);
      return { message: AdminResponseMessages.FORGOT_PASSWORD_EMAIL_SENT };
    }

    @ApiOperation({summary:'Password reset email'})
    @Post('reset-password')
    @HttpCode(200)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
      
      try {
       
        const { email, otp, newPassword } = resetPasswordDto;
        const result = await this.adminService.resetPassword(email, otp, newPassword);
        console.log(result)
        return {
          message: AdminResponseMessages.PASSWORD_RESET_SUCCESS,
          action: 'Please login: http://localhost:3000/admins/login',
        };
      } catch (error) {
        console.log(error);
        return {
          
          message: AdminResponseMessages.PASSWORD_RESET_FAILED,
          action: 'TRY AGAIN HERE: http://localhost:3000/forgotPassword',
        };
      }
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'Admin Logout'})
    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req: any): Promise<{ message: string }> {
      try {
        const  adminId  = (req.user.userId).toString();
        await redis.set(adminId, 'false')
        return { message: AdminResponseMessages.LOGOUT_SUCCESS };
      } catch (error) {
        throw new HttpException(AdminResponseMessages.LOGOUT_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
      }

 
    }
    @ApiBearerAuth()
    @ApiOperation({summary:'admin change-password'})
    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Request() req, @Body() adminchangePasswordDto: AdminChangePasswordDto) {
    const userId = req.user.userId; 

    try {
      await this.adminService.changePassword(userId, adminchangePasswordDto);
      return { message: AdminResponseMessages.PASSWORD_UPDATED };
    } catch (error) {
      throw new Error(AdminResponseMessages.PASSWORD_FAILED);
    }
  }

  // @Get()
  // async getAllOrders(@Request() req) {
  //   const role = req.user.role
  //   if(role!=='admin')
  //   {
  //     console.log("You are not ")
  //   }
  //   const orders = await this.adminService.getAllOrders();
  //   return {orders}
  // }


    
    

}
