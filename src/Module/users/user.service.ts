import { Injectable, InternalServerErrorException, NotFoundException, UseGuards, Request, ConflictException, Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/user-signup.dto';
import { UpadteUserDto } from './dto/update-user.dto';
import * as nodemailer from 'nodemailer';
import { redis } from 'src/providers/database/redis.connection';
import { Session } from './entity/session.entity';
import { join } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private jwtService: JwtService,
    
  ) {}
  
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
    password, // Don't hash the password here
    contactNumber,
  });

  newUser.hashPassword(); // Hash the password before saving

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


  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({where: {email}});
  
    if (!user) {
      throw new NotFoundException('Email not found');
    }
  
    const OTP = Math.floor(1000 + Math.random() * 9000);
    await redis.set(email,OTP.toString())

    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'apurv1@appinventiv.com',
        pass: 'atldfmccuufdvqzm' ,
      },
    });

    const templatePath =  join('/home/admin2/Desktop/dem/my-nest-app/src/email-template')
    const htmlTemplate =   readFileSync(`${templatePath}/password-reset.html`, 'utf-8');
    const textTemplate =  readFileSync(`${templatePath}/password-reset.txt`, 'utf-8');
  
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

  async resetPassword(email: string, otp: string , newPassword: string): Promise<string> {
  
  
    let redisOTP = await redis.get(email)
    console.log(redisOTP)
    if (redisOTP==otp) {
      console.log("enter resetpassword verify")
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await this.userRepository.findOne({where: {email}});
      
      if (user) {
        user.password = hashedPassword;
        await this.userRepository.save(user);
        // await client.DEL(email);
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

}
