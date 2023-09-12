import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryBoy } from './entity/del.entity';
import { DBSignupDto } from './dto/create.dto';
import * as bcrypt from 'bcrypt';
import { Order } from '../orders/entity/order.entity';
import { User } from '../users/entity/user.entity';
import * as nodemailer from 'nodemailer';
import { redis } from 'src/providers/database/redis.connection';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class DeliveryBoyService {
  constructor(
    @InjectRepository(DeliveryBoy)
    private readonly deliveryBoyRepository: Repository<DeliveryBoy>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async validateUser(email: string, password: string): Promise<DeliveryBoy | null> {
    const user = await this.deliveryBoyRepository.findOne({ where: { email } }); 
    console.log(email , password , user.password)
    if (user && (await bcrypt.compare(password,user.password))) {
      console.log(user)
      return user;
    }
    return null;
  }

  async signup(signupDto: DBSignupDto): Promise<void> {
    const { name,email, password, } = signupDto;
    
    const existingUser = await this.deliveryBoyRepository.findOne({ where: { email } });
    if (existingUser) {
    throw new ConflictException('this email already exists');
   }
   const hashedPassword = await this.hashPassword(password)

  const newUser = this.deliveryBoyRepository.create({
    name,
    email,
    password: hashedPassword,
    
  });
  // newUser.hashPassword(password); 
  await this.deliveryBoyRepository.save(newUser);
  
  }

  async confirmDeliveryOtp(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      return null; // Order not found
    }
    const user = await this.userRepository.findOne({where: {id:order.userId}})
    const customerEmail = user.email
    const OTP = Math.floor(1000 + Math.random() * 9000);
    await redis.set(customerEmail,OTP.toString())

    
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

    const mailOptions = {
      from: 'apurv1@appinventiv.com',
      to: customerEmail,
      subject: 'Order Confirmation Otp',
      text:`Your otp ${OTP}` 
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

  async confirmDelivery(orderId: number, otp:string): Promise<void> {
   
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      return null; // Order not found
    }
    const user = await this.userRepository.findOne({where: {id:order.userId}})
    const customerEmail = user.email
    let redisOTP = await redis.get(customerEmail);
    if(redisOTP==otp)
    {
      order.orderDelivered = true;
      await this.orderRepository.save(order);
    }
    else{
      throw new Error('Invalid OTP')
    } 
  }

  async updateUserDetails(email: string , updateDelDto: UpdateDto): Promise<void>{
    const del = await this.deliveryBoyRepository.findOne({where: {email}});
  
    if(!del){
      throw new NotFoundException('User not found');
    }
    del.name = updateDelDto.name;
    del.email = updateDelDto.email;
    await this.deliveryBoyRepository.save(del);
   }

  private async hashPassword(password:string): Promise<string>{
    return await bcrypt.hash(password,10);
  }

  }
