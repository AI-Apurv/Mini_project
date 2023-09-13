import { Injectable, InternalServerErrorException, NotFoundException,ConflictException, BadRequestException} from '@nestjs/common';
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


const client = createClient()

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    
  ) { dotenv.config()}
 
  async signup(signupDto: SignupDto): Promise<void> {
    const { username, firstName, lastName, email, password, contactNumber } = signupDto;
    
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
    throw new ConflictException('User with this email already exists');
   }

  const newUser = this.userRepository.create({
    username,
    firstName,
    lastName,
    email,
    password,
    contactNumber,
  });
  newUser.hashPassword(); 
  await this.userRepository.save(newUser);
  
  }


  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } }); 
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }


  async updateUserDetails(email: string , updateUserDto: UpadteUserDto): Promise<void>{
    const user = await this.userRepository.findOne({where: {email}});
  
    if(!user){
      throw new NotFoundException('User not found');
    }
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.contactNumber = updateUserDto.contactNumber;
    await this.userRepository.save(user);
   }
  

   async deleteUser(email:string): Promise<void>{
    const user = await this.userRepository.findOne({where: {email}});
    if(!user){
      throw new NotFoundException('User not found')
    }
    await this.userRepository.remove(user);
  }

  async changePassword(userId: number,userchangePasswordDto: UserChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({where:{id:userId}});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.validateOldPassword(user, userchangePasswordDto.oldPassword);

    if(!isPasswordValid){
      throw new BadRequestException('Invalid old password')
    }

    if (userchangePasswordDto.oldPassword === userchangePasswordDto.newPassword){
      throw new BadRequestException('New password must be different from the old password')
    }
    
    
    user.password = await this.hashPassword(userchangePasswordDto.newPassword);

    await this.userRepository.save(user);
  }

  private async validateOldPassword(user:User , oldPassword:string): Promise<boolean>{
    return await bcrypt.compare(oldPassword,user.password)
  }

  private async hashPassword(password:string): Promise<string>{
    return await bcrypt.hash(password,10);
  }



  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({where: {email}});
  
    if (!user) {
      throw new NotFoundException('Email not found');
    }
  
    const OTP = Math.floor(1000 + Math.random() * 9000);
    await redis.set(email,OTP.toString(),'EX',60)

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD ,
      },
    });

    const templatePath =  join('/home/admin2/Desktop/dem/my-nest-app/src/email-template')
    const htmlTemplate =   readFileSync(`${templatePath}/password-reset.html`, 'utf-8');  
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: htmlTemplate.replace('{{ OTP }}',OTP.toString())
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new InternalServerErrorException('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  }

  async verifyUserEmail(email:string): Promise<void>{
       const user = await this.userRepository.findOne({where: {email}});
    
      if (!user) {
        throw new NotFoundException('Email not found');
      }
    
      const OTP = Math.floor(1000 + Math.random() * 9000);
      await redis.set(email,OTP.toString(),'EX',60)
  
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD ,
        },
      });
    
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email Verification otp',
        text: `otp to verify mail ${OTP}`
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          throw new InternalServerErrorException('Error sending email');
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    }

    async emailVerificationOtp(email: string, otp: string ): Promise<{message:string}> {
     console.log('inside the service',otp, email)
      let redisOTP = await redis.get(email)
      console.log(redisOTP)
      const user = await this.userRepository.findOne({where:{email:email}})
      if(!user)
      {
        return {message: 'Email does not exist'}
      }
      if (redisOTP==otp) {
        user.isActive = true
        this.userRepository.save(user);
        return {message: 'email verified successfully'}
        }
      else{
        return {message:"Invalid otp"}
      }

    }
  
  

  
  
  async resetPassword(email: string, otp: string , newPassword: string): Promise<string> {
    let redisOTP = await redis.get(email)
    console.log(redisOTP)
    if (redisOTP==otp) {
      console.log("enter resetpassword verify")
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await this.userRepository.findOne({where: {email}});
      if(user)
      await redis.del(email)
      
      if (user) {
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return 'Password reset successful. Please login again.';
      }
    } else {
      console.log()
      throw new Error('Invalid OTP');
    }
  }


  async getActiveSession(userId: number): Promise<Session | undefined> {
    console.log("Inside get active session")
    return this.sessionRepository.findOne({
      where: { user: { id: userId }, isActive: true },
    });
  }

  
  async updateSession(session: Session, isActive: boolean):Promise<void>{
    session.isActive = isActive;
    await this.sessionRepository.save(session);
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    const existingUser = await this.userRepository.findOne({where:{email:req.user.email}})
    if(existingUser){
     return 'User logged in successful,'
    }
    else{
      const newUser = new User();
      newUser.firstName = req.user.firstName;
      newUser.lastName = req.user.lastName;
      newUser.email = req.user.email;
      console.log('@@@@@@@@@@@@@@@',newUser)
      await this.userRepository.save(newUser)
    }
    return {
      message: 'User information from google',
      user: req.user
    }
  }

}




