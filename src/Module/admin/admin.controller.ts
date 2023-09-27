import { Body, Res, Controller, Patch, Delete, Post, Get, UseGuards, ValidationPipe, Request, Param, HttpException, HttpCode, HttpStatus } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { JwtAdminAuthGuard, JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { AdminUpdateDto } from "./dto/admin-update.dto";
import { ADMINRESPONSE, AdminResponseMessages } from "src/common/responses/admin.response";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { redis } from "src/providers/database/redis.connection";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AdminChangePasswordDto } from "./dto/change-password.dto";
import { httpResponse } from "src/Middleware/httpResponse";
import { Response, response } from 'express';


@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService,
    private readonly httpResponse: httpResponse) { }



  /**
 * @author Apurv
 * @description This function will be used to create admin
 */
  async createAdmin(@Res() response: Response) {
    await this.adminService.createAdmin();
    return this.httpResponse.sendResponse(response, ADMINRESPONSE.ADMIN_CREATED)
  }




  /**
* @author Apurv
* @description This function will used for admin login.Implemented two factor authentication for admin login
* @Body AdminLoginDto
* @payload email , password , otp
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Login' })
  @Post('login')
  async login(@Body() loginDto: AdminLoginDto, @Res() response: Response) {
    const token = await this.adminService.login(loginDto);
    return this.httpResponse.sendResponse(response, ADMINRESPONSE.LOGIN_SUCCESS, token)
    
  }




  /**
* @author Apurv
* @description This function will used to update the admin details
* @Body AdminUpdateDto
* @Payload firstname , lastname , email
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update admin details' })
  @Patch('update')
  @UseGuards(JwtAdminAuthGuard)
  async updateAdmin(@Body(new ValidationPipe()) updateDto: AdminUpdateDto, @Request() req: any, @Res() response: Response) {
    const adminId = req.user.userId;
    const sessionStatus = await redis.get(adminId.toString());
    if (sessionStatus === 'false') {
      const resp = this.httpResponse.sendResponse(response, ADMINRESPONSE.SESSION_STATUS)
      return resp;
    }
    await this.adminService.updateAdmin(updateDto, adminId);
    return this.httpResponse.sendResponse(response, ADMINRESPONSE.UPDATE_SUCCESS)
  }





  /**
* @author Apurv
* @description This function will used by admin to verify the sellers
* @Param sellerId
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify the Sellers' })
  @Post(':sellerid/verify')
  @UseGuards(JwtAuthGuard)
  async verifySeller(@Param('sellerid') sellerid: number, @Request() req: any, @Res() response: Response) {
    const admin = req.user;
    await this.adminService.verifySeller(sellerid);
    return this.httpResponse.sendResponse(response, ADMINRESPONSE.VERIFY_SELLER_SUCCESS)
  }




  /**
* @author Apurv
* @description This function will used to delete the admin  
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete admin' })
  @Delete('delete-admin')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req: any, @Res() response: Response) {
    try {
      const { email, userId } = req.user;
      const sessionStatus = await redis.get(userId.toString());

      if (sessionStatus === 'false') {
        return this.httpResponse.sendResponse(response, ADMINRESPONSE.SESSION_STATUS)
      }
      await this.adminService.deleteUser(email);
      return this.httpResponse.sendResponse(response, ADMINRESPONSE.DELETE_SUCCESS)
    } catch (error) {
      return this.httpResponse.sendResponse(response, ADMINRESPONSE.DELETE_FAILED)   
    }
  }




  /**
* @author Apurv
* @description This function will used to send forgot password email to admin
* @Body ForgotPasswordDto
* @payload email
*/
  @ApiOperation({ summary: 'admin forgot password' })
  @Post('forgot-password')
  async sendPasswordResetEmail(@Body() forgotPasswordDto: ForgotPasswordDto, @Res() response: Response) {
    await this.adminService.sendPasswordResetEmail(forgotPasswordDto.email);
    return this.httpResponse.sendResponse(response, ADMINRESPONSE.FORGOT_PASSWORD_EMAIL_SENT)
   
  }




  /**
* @author Apurv
* @description This function will used to reset the password 
* @Body ResetPasswordDto
* @payload email , otp , newPassword
*/
  @ApiOperation({ summary: 'Password reset email' })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() response: Response) {
    try {
      const { email, otp, newPassword } = resetPasswordDto;
      const result = await this.adminService.resetPassword(email, otp, newPassword);
      return this.httpResponse.sendResponse(response, ADMINRESPONSE.PASSWORD_RESET_SUCCESS)
    } catch (error) {
      console.log(error);
      return this.httpResponse.sendResponse(response, ADMINRESPONSE.PASSWORD_RESET_FAILED)
    }
  }




  /**
* @author Apurv
* @description This function will used by admin for logout 
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin Logout' })
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any, @Res() response: Response) {
    try {
      const adminId = (req.user.userId).toString();
      await redis.set(adminId, 'false')
      return this.httpResponse.sendResponse(response, ADMINRESPONSE.LOGOUT_SUCCESS)
    } catch (error) {
      throw new HttpException(AdminResponseMessages.LOGOUT_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




  /**
* @author Apurv
* @description This function will used to change the admin password
* @Body AdminChangePasswordDto
* @Payload oldPassword , newPassword
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'admin change-password' })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body(new ValidationPipe()) adminchangePasswordDto: AdminChangePasswordDto, @Res() response: Response) {
    const userId = req.user.userId;
    try {
      await this.adminService.changePassword(userId, adminchangePasswordDto);
      return this.httpResponse.sendResponse(response, ADMINRESPONSE.PASSWORD_UPDATED)
    }
    catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
    throw new Error(AdminResponseMessages.PASSWORD_FAILED);
  }




  /**
* @author Apurv
* @description This function will used to block the user
* @Param userId
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'block the user' })
  @UseGuards(JwtAdminAuthGuard)
  @Post(':userId/block-user')
  async blockUsers(@Param('userId') userId: number, @Request() req: any, @Res() response: Response) {
    await this.adminService.blockUser(userId)
    return this.httpResponse.sendResponse(response, ADMINRESPONSE.BLOCK_USER);
  }




  /**
* @author Apurv
* @description This function will used to unblock the user
* @Param userId
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'unblock the user' })
  @UseGuards(JwtAdminAuthGuard)
  @Post(':userId/unblock-user')
  async unblockUsers(@Param('userId') userId: number, @Request() req: any, @Res() response: Response) {
    await this.adminService.unblockUser(userId)
    return this.httpResponse.sendResponse(response, ADMINRESPONSE.UNBLOCK_USER);
  }




}
