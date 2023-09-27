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
import { deliveryBoyResponseMessage } from 'src/common/responses/deliveryBoy.response';
import { Orderstatus } from '../orders/order.model';

@Injectable()
export class DeliveryBoyService {
  constructor(
    @InjectRepository(DeliveryBoy)
    private readonly deliveryBoyRepository: Repository<DeliveryBoy>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }




  async validateUser(email: string, password: string) {
    const user = await this.deliveryBoyRepository.findOne({ where: { email } });
    console.log(email, password, user.password)
    if (user && (await bcrypt.compare(password, user.password)))
      return user;
    return null;
  }




  async signup(signupDto: DBSignupDto) {
    const { name, email, password } = signupDto;
    const existingUser = await this.deliveryBoyRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(deliveryBoyResponseMessage.ALREADY_EXIST);
    }
    const hashedPassword = await this.hashPassword(password)
    const newUser = this.deliveryBoyRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await this.deliveryBoyRepository.save(newUser);
  }





  async confirmDeliveryOtp(orderId: number) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      return null;
    }
    const user = await this.userRepository.findOne({ where: { id: order.userId } })
    const customerEmail = user.email
    const OTP = Math.floor(1000 + Math.random() * 9000);
    await redis.set(customerEmail, OTP.toString())

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'apurv1@appinventiv.com',
        pass: 'atldfmccuufdvqzm',
      },
    });

    const mailOptions = {
      from: 'apurv1@appinventiv.com',
      to: customerEmail,
      subject: 'Order Confirmation Otp',
      text: `Your otp ${OTP}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new InternalServerErrorException(deliveryBoyResponseMessage.ERROR_MAIL);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  }





  async confirmDelivery(orderId: number, otp: string): Promise<void> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      return null;
    }
    const user = await this.userRepository.findOne({ where: { id: order.userId } })
    const customerEmail = user.email
    let redisOTP = await redis.get(customerEmail);
    if (redisOTP == otp) {
      order.orderDelivered = true;
    order.orderStatus = Orderstatus.delivered;
      await this.orderRepository.save(order);
    }
    else {
      throw new Error(deliveryBoyResponseMessage.INVALID_OTP)
    }
  }





  async updateUserDetails(email: string, updateDelDto: UpdateDto) {
    const del = await this.deliveryBoyRepository.findOne({ where: { email } });
    if (!del) {
      throw new NotFoundException(deliveryBoyResponseMessage.NOT_FOUND);
    }
    del.name = updateDelDto.name;
    del.email = updateDelDto.email;
    await this.deliveryBoyRepository.save(del);
  }




  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }





}
