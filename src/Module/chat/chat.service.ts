import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entity/chat.entity';
import { User } from '../users/entity/user.entity';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { MessageDto } from './dto/message.dto';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }




  async getUserFromSocket(socket: Socket) {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader) {
      throw new WsException('Missing authorization header');
    }
    const [, authToken] = authHeader.split(' ');
    if (!authToken) {
      throw new WsException('Invalid authorization token');
    }
    try {
      const payload: JwtPayload = this.jwtService.verify(authToken, {
        secret: 'your_secret_key'
      })
      const user = await this.userRepository.findOne({ where: { email: payload.email } })
      if (!user) {
        throw new WsException('User not found');
      }
      return user;
    } catch (error) {
      throw new WsException('Invalid credentials');
    }
  }




  async createMessage(message: string, userId: number, receiverId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const uId = user.id
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } })
    if (!user || !receiver) {
      throw new WsException('sender or receiver not found');
    }

    const newMessage = new Message();
    newMessage.message = message;
    newMessage.senderId = uId;
    newMessage.receiverId = receiverId;
    await this.messageRepository.save(newMessage);
    return newMessage;
  }




  async getChatsBetweenSenderAndReceiver(senderId: number, receiverId: number) {
    const chats = await this.messageRepository
      .createQueryBuilder('message')
      .where('(message.senderId = :senderId AND message.receiverId = :receiverId) OR (message.senderId = :receiverId AND message.receiverId = :senderId)', {
        senderId,
        receiverId,
      })
      .getMany();

    return chats;
  }




  async getAllMessages() {
    return this.messageRepository.find({ relations: ['user'] });
  }



  
}
