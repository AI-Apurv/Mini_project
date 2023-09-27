import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entity/seller.entity';
import { SellerSignupDto } from './dto/seller-signup.dto';
import * as bcrypt from 'bcrypt';
import { SellerLoginDto } from './dto/seller-login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { redis } from 'src/providers/database/redis.connection';
import * as nodemailer from 'nodemailer'
import { readFileSync } from 'fs';
import { join } from 'path';
import { SellerChangePasswordDto } from './dto/change-password.dto';
import { Order } from '../orders/entity/order.entity';
import { sellerResponseMessage } from 'src/common/responses/seller.response';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private jwtService: JwtService
  ) { }

  async getSellerById(userId: number): Promise<Seller | undefined> {
    try {
      const seller = await this.sellerRepository.findOne({ where: { sellerid: userId } });
      return seller;
    }
    catch (error) {
      throw error;
    }
  }




  async signup(signupDto: SellerSignupDto) {
    const { name, email, password, contactNumber } = signupDto;
    const existingSeller = await this.sellerRepository.findOne({ where: { email } });
    if (existingSeller) {
      throw new ConflictException(sellerResponseMessage.ALREADY_EXIST);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = this.sellerRepository.create({
      name,
      email,
      password: hashedPassword,
      contactNumber
    });
    await this.sellerRepository.save(newSeller);
  }




  async login(loginDto: SellerLoginDto) {
    const { email, password } = loginDto;
    const seller = await this.sellerRepository.findOne({ where: { email } });
    if (!seller || !(await bcrypt.compare(password, seller.password))) {
      throw new UnauthorizedException(sellerResponseMessage.INVALID_CREDENTIALS);
    }
    const payload = { sub: seller.sellerid, email: seller.email, role: seller.role, verify: seller.verify };
    const token = this.jwtService.sign(payload);
    return {token, seller};
  }




  async updateSellerDetails(email: string, updateSellerDto: UpdateSellerDto): Promise<void> {
    const seller = await this.sellerRepository.findOne({ where: { email } });
    if (!seller) {
      throw new NotFoundException(sellerResponseMessage.NOT_FOUND);
    }
    seller.name = updateSellerDto.name;
    seller.contactNumber = updateSellerDto.contactNumber;
    await this.sellerRepository.save(seller);
  }




  async deleteUser(email: string): Promise<void> {
    const user = await this.sellerRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(sellerResponseMessage.NOT_FOUND)
    }
    await this.sellerRepository.remove(user);
  }




  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.sellerRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(sellerResponseMessage.NOT_FOUND);
    }
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
      if (error) {
        console.log(error);
        throw new InternalServerErrorException('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  }




  async resetPassword(email: string, otp: string, newPassword: string): Promise<string> {
    let redisOTP = await redis.get(email)
    console.log(redisOTP)
    if (redisOTP == otp) {
      console.log("enter resetpassword verify")
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await this.sellerRepository.findOne({ where: { email } });
      if (user)
        await redis.del(email)
      if (user) {
        user.password = hashedPassword;
        await this.sellerRepository.save(user);
        return 'Password reset successful. Please login again.';
      }
    } else {
      throw new Error('Invalid OTP');
    }
  }




  async changePassword(sellerId: number, sellerchangePasswordDto: SellerChangePasswordDto): Promise<void> {
    const seller = await this.sellerRepository.findOne({ where: { sellerid: sellerId } });
    if (!seller) {
      throw new Error('Seller not found');
    }
    const isPasswordValid = await this.validateOldPassword(seller, sellerchangePasswordDto.oldPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid old password')
    }
    if (sellerchangePasswordDto.oldPassword === sellerchangePasswordDto.newPassword) {
      throw new BadRequestException('New password must be different from the old password')
    }
    seller.password = await this.hashPassword(sellerchangePasswordDto.newPassword);
    await this.sellerRepository.save(seller);
  }




  private async validateOldPassword(seller: Seller, oldPassword: string): Promise<boolean> {
    return await bcrypt.compare(oldPassword, seller.password)
  }




  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }




  async getSoldProducts(sellerId: number): Promise<any[]> {
    try {
      const soldProducts = await this.orderRepository.find({
        where: { sellerId },
        relations: ['products'],
      });
      return soldProducts;
    }
    catch (error) {
      throw new HttpException('Failed to fetch sold product', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }





}
