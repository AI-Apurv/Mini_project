import { Response } from 'express';
import { Post, Body, ValidationPipe, HttpException, HttpStatus, Controller, Delete, Patch, UseGuards, Request, HttpCode, Get, Req, Res } from "@nestjs/common";
import { SignupDto } from "./dto/user-signup.dto";
import { LoginDto } from "./dto/user-login.dto";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { UpadteUserDto } from "./dto/update-user.dto";
import { ForgotPasswordDto } from "./dto/forget-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { redis } from 'src/providers/database/redis.connection';
import { createClient } from 'redis';
import { userResponseMessages } from "src/common/responses/user.response";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserChangePasswordDto } from "./dto/change-password.dto";
import { verifyEmailOtp } from "./dto/verify-email-otp.dto";
import { AuthGuard } from "@nestjs/passport";
import { verifyContactDto } from "./dto/verify-Contact.dto";
import { httpResponse } from "src/Middleware/httpResponse";
import { USERRESPONSE } from "src/common/responses/user.response";
import { Userstatus } from './user.model';
import { verifyContactNumberDto } from './dto/contactVerify.dto';
const client = createClient()
client.connect();

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpResponse: httpResponse) { }




  /**
 * @author Apurv
 * @description This function will used for user signup
 * @Body SignupDto
 * @Payload username , email , password , firstname , lastname , contactNumber
 */
  @ApiOperation({ summary: 'User Signup' })
  @Post('signup')
  async signup(@Body(new ValidationPipe({ transform: true })) signupDto: SignupDto, @Res() response: Response) {
    await this.userService.signup(signupDto);
    return this.httpResponse.sendResponse(response, USERRESPONSE.SIGNUP_SUCCESS)
  }




  /**
 * @author Apurv
 * @description This function will used for user login.
 * @Body LoginDto
 * @payload email , password
 */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto, @Res() response: Response, @Request() req) {
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);
    if (!user)
      return this.httpResponse.sendResponse(response, USERRESPONSE.INVALID_CREDENTIALS)
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    await client.set(`${user.email}${user.id.toString()}`, 'true')
    return this.httpResponse.sendResponse(response, USERRESPONSE.LOGIN_SUCCESS, accessToken)
  }




  /**
 * @author Apurv
 * @description This function will used for sending email for verifying user email
 */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'verify user email' })
  @UseGuards(JwtAuthGuard)
  @Post('send/verify-email')
  async verifyEmail(@Request() req: any, @Res() response: Response) {
    const mail = req.user.email
    await this.userService.verifyUserEmail(mail)
    return this.httpResponse.sendResponse(response, USERRESPONSE.EMAIL_SENT)
  }




  /**
* @author Apurv
* @description This function will used for verifying the user email
* @Body VerifyEmailOtp
* @Payload otp
*/
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'enter email verification otp' })
  @Post('enter/email-verify-otp')
  async enterOtp(@Request() req, @Body() verifyOtp: verifyEmailOtp, @Res() response: Response) {
    const mail = req.user.email;
    const otp = verifyOtp.otp;
    await this.userService.emailVerificationOtp(mail, otp)
    return this.httpResponse.sendResponse(response, USERRESPONSE.EMAIL_VERIFY)
  }




  /**
* @author Apurv
* @description This function will used by user to update their details
* @Body UpdateUserDto
* @Payload firstname , lastname , contact number
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user details' })
  @Patch('update-users')
  @UseGuards(JwtAuthGuard)
  async updateDetails(@Body(new ValidationPipe()) updateUserDto: UpadteUserDto, @Request() req: any) {
    try {
      const { email } = req.user;
      await this.userService.updateUserDetails(email, updateUserDto);
      return userResponseMessages.UPDATE_SUCCESS
    } catch (error) {
      throw new HttpException(userResponseMessages.UPDATE_FAILED,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }




  /**
* @author Apurv
* @description This function will used for deleting user account
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @Delete('delete-user')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req: any) {
    try {
      const { email, userId } = req.user;
      await this.userService.deleteUser(email);
      return userResponseMessages.DELETE_SUCCESS
    } catch (error) {
      throw new HttpException(userResponseMessages.DELETE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }




  /**
* @author Apurv
* @description This function will used by user to change their password
* @Body userChangePasswordDto
* @payload old password , new password
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'change user password' })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body(new ValidationPipe()) userchangePasswordDto: UserChangePasswordDto, @Res() response:Response) {
    const userId = req.user.userId;
    try {
      await this.userService.changePassword(userId, userchangePasswordDto);
      return this.httpResponse.sendResponse(response,USERRESPONSE.PASSWORD_CHANGED_SUCCESS);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(userResponseMessages.PASSWORD_CHANGE, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }




  /**
* @author Apurv
* @description This function will used to send forgot password email
* @Body ForgotPasswordDto
* @payload email
*/
  @ApiOperation({ summary: 'user forgot password' })
  @Post('forgot-password')
  async sendPasswordResetEmail(@Body() forgotPasswordDto: ForgotPasswordDto, @Res() response:Response) {
    await this.userService.sendPasswordResetEmail(forgotPasswordDto.email);
    return this.httpResponse.sendResponse(response, USERRESPONSE.FORGOT_PASSWORD_EMAIL_SENT)
  }




  /**
* @author Apurv
* @description This function will used by user to reset their password
* @Body ResetPasswordDto
* @payload email , otp , newPassword
*/
  @ApiOperation({ summary: 'Password reset email' })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto, @Res() response: Response) {
    try {
      const { email, otp, newPassword } = resetPasswordDto;
      const result = await this.userService.resetPassword(email, otp, newPassword);
      return this.httpResponse.sendResponse(response, USERRESPONSE.PASSWORD_RESET_SUCCESS)
    } catch (error) {
      return this.httpResponse.sendResponse(response, USERRESPONSE.PASSWORD_RESET_FAILED);
    }
  }




  /**
* @author Apurv
* @description This function will used by user for logout 
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User Logout' })
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any, @Res() response: Response) {
    try {
      const userId = (req.user.userId).toString();
      await redis.set(`${req.user.email}${req.user.userId}`, 'false')
      return this.httpResponse.sendResponse(response, USERRESPONSE.LOGOUT_SUCCESS)
    } catch (error) {
      return this.httpResponse.sendResponse(response, USERRESPONSE.INTERNAL_SERVER_ERROR)
    }
  }




  /**
* @author Apurv
* @description This function will used for google signup
*/
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) { }




  /**
* @author Apurv
* @description This function will redirect user to google login page
*/
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() response: Response) {
    await this.userService.googleLogin(req)
    return this.httpResponse.sendResponse(response, USERRESPONSE.LOGIN_SUCCESS,)
  }




  /**
* @author Apurv
* @description This function will used for sending otp to user's contact number. Implemented twilio for sending otp to mobile number 
* @Body verifyContactDto
* @payload contactNumber
*/
  @Post('send-code')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'send otp for verify contact number' })
  async sendVerificationCode(@Body() verifyContact: verifyContactDto, @Request() req, @Res() response: Response) {
    try {
      const userId = req.user.userId;
      await this.userService.sendVerificationCode(verifyContact.contactNumber, userId)
      return this.httpResponse.sendResponse(response, USERRESPONSE.CODE_SENT);
    }
    catch (error) {
      return this.httpResponse.sendResponse(response, USERRESPONSE.CODE_NOT_SENT)
    }
  }



  /**
* @author Apurv
* @description This function will used for verifying otp which is sent to user contact number 
* @Body verifyContactNumberDto
* @payload otp
*/
  @Post('verify-code')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'verify otp for verify contact number' })
  async verifyContact(@Body() verifyContact: verifyContactNumberDto, @Request() req, @Res() response: Response) {
    try {
      const user = req.user;
      await this.userService.verifyContactCode(verifyContact.otp, user.userId)
      return this.httpResponse.sendResponse(response, USERRESPONSE.CONTACT_VERIFY)
    }
    catch (error) {
      return this.httpResponse.sendResponse(response, USERRESPONSE.CONTACT_NOT_VERIFY)
    }
  }




}