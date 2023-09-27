import { Injectable, InternalServerErrorException, NotFoundException, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/user-signup.dto';
import { UpadteUserDto } from './dto/update-user.dto';
import { UserChangePasswordDto } from './dto/change-password.dto';
import * as nodemailer from 'nodemailer';
import { redis } from 'src/providers/database/redis.connection';
import { Session } from './entity/session.entity';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv'
import { createClient } from 'redis';
import * as twilio from 'twilio';
import { Userstatus } from './user.model';
import { USERRESPONSE, userResponseMessages } from 'src/common/responses/user.response';
const client = createClient()




@Injectable()
export class UserService {
  private readonly tClient: twilio.Twilio;
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,

  ) {
    dotenv.config(),
      this.tClient = twilio(process.env.TWILIO_ID, process.env.TWILIO_SECRET)
  }



  
  async findUser(email: string) {
    const user = this.userRepository.findOne({ where: { email: email } })
    if(user) return user
    else return null
  }




  async signup(signupDto: SignupDto) {
    const { username, firstName, lastName, email, password, contactNumber } = signupDto;
    let existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      if (existingUser.userStatus === Userstatus.deleted) {
        existingUser.username = username;
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.password = password;
        existingUser.userStatus = Userstatus.active;
        await this.userRepository.save(existingUser);
      } else {
        throw new ConflictException(userResponseMessages.ALREADY_EXISTS);
      }
    } else {
      const newUser = this.userRepository.create({ username, firstName, lastName, email, password, contactNumber, userStatus: Userstatus.active });
      newUser.hashPassword();
      await this.userRepository.save(newUser);
    }
  }




  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }




  async checkUserStatus(user: User) {
    const status = user.userStatus;
    return status;
  }




  async updateUserDetails(email: string, updateUserDto: UpadteUserDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.contactNumber = updateUserDto.contactNumber;
    await this.userRepository.save(user);
  }




  async deleteUser(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found')
    user.userStatus = Userstatus.deleted
    await this.userRepository.save(user);
  }




  async changePassword(userId: number, userchangePasswordDto: UserChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const isPasswordValid = await this.validateOldPassword(user, userchangePasswordDto.oldPassword);
    if (!isPasswordValid) throw new BadRequestException('Invalid old password')
    if (userchangePasswordDto.oldPassword === userchangePasswordDto.newPassword)
      throw new BadRequestException('New password must be different from the old password')
    user.password = await this.hashPassword(userchangePasswordDto.newPassword);
    await this.userRepository.save(user);
  }




  private async validateOldPassword(user: User, oldPassword: string): Promise<boolean> {
    return await bcrypt.compare(oldPassword, user.password)
  }




  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }




  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Email not found');
    const OTP = Math.floor(1000 + Math.random() * 9000);
    await redis.set(email, OTP.toString(), 'EX', 60)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const templatePath = join('/home/admin2/Desktop/dem/my-nest-app/src/email-template')
    const htmlTemplate = readFileSync(`${templatePath}/password-reset.html`, 'utf-8');
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: htmlTemplate.replace('{{ OTP }}', OTP.toString())
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        throw new InternalServerErrorException('Error sending email');
      else
        console.log('Email sent: ' + info.response);
    })
  }




  async verifyUserEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Email not found');
    const OTP = Math.floor(1000 + Math.random() * 9000);
    await redis.set(email, OTP.toString(), 'EX', 60)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Email Verification otp',
      text: `otp to verify mail ${OTP}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        throw new InternalServerErrorException('Error sending email');
      else
        console.log('Email sent: ' + info.response);
    })
  }




  async emailVerificationOtp(email: string, otp: string){
    let redisOTP = await redis.get(email)
    const user = await this.userRepository.findOne({ where: { email: email } })
    if (!user) return userResponseMessages.EMAIL_NOT_EXIST;
    if (redisOTP == otp) {
      user.isActive = true
      this.userRepository.save(user);
      await redis.del(email)
    }
    else {
      throw new BadRequestException(userResponseMessages.INVALID_OTP);
    }

  }




  async resetPassword(email: string, otp: string, newPassword: string): Promise<string> {
    let redisOTP = await redis.get(email)
    if (redisOTP == otp) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) await redis.del(email)
      if (user) {
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return 'Password reset successful. Please login again.';
      }
    } else {
      throw new Error('Invalid OTP');
    }
  }




  async getActiveSession(userId: number) {
    return this.sessionRepository.findOne({
      where: { user: { id: userId }, isActive: true },
    });
  }




  async updateSession(session: Session, isActive: boolean) {
    session.isActive = isActive;
    await this.sessionRepository.save(session);
  }





 async googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }
    const existingUser = await this.userRepository.findOne({where:{email:req.user.email}})
    if(existingUser)
    return USERRESPONSE.LOGIN_SUCCESS
    else
    {
      const newUser = new User();
      newUser.firstName = req.user.firstName;
      newUser.lastName = req.user.lastName;
      newUser.email = req.user.email;
      const passwordLength = 8 ;
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let password = '';
      for(let i=0 ; i<passwordLength ; i++){
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      newUser.password = password;
      const randomNumber = Math.floor(Math.random() * 100 )+1;
      newUser.username = `${newUser.firstName}${randomNumber}`;
      newUser.userStatus = Userstatus.active
      await this.userRepository.save(newUser);
      const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.user.email,
      subject: 'username and password',
      text: `your login credentials are email ${req.user.email} and password ${password}. Your username is ${newUser.username}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error)
        throw new InternalServerErrorException('Error sending email');
      else
        console.log('Email sent: ' + info.response);
    })
    }
    return {
      message: 'User information from google',
      user: req.user
    }
  }




  async sendVerificationCode(phoneNumber: string, userId: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } })
      if (user.contactNumber !== phoneNumber)
       throw new ConflictException('This contact number is invalid or it is not registered')
      const code = Math.floor(1000 + Math.random() * 9000);
      await redis.set(phoneNumber, code.toString(), 'EX', 60)
      const message = await this.tClient.messages.create({
        body: `Your verification code is : ${code}`,
        to: `+91${phoneNumber}`,
        from: '+12565300048'
      });
    }
    catch (error) {
      throw new Error('Failed to send verification code');
    }
  }



  
  async verifyContactCode(otp:string,userId:number) {
    const user = this.userRepository.findOne({where:{id:userId}})
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } })
      const code = await redis.get(`${user.contactNumber}`)
      if(code==otp)
      {
        user.isActive = true
        this.userRepository.save(user);
      }
      else{
        throw new BadRequestException('Invalid OTP');
      }
    }
    catch (error) {
      throw new Error('Failed to send verification code');
    }
  }




}




