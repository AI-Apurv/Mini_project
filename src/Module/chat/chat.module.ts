import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/chat.entity';
import { ChatsController } from './chat.controller';
import { ChatsService } from './chat.service';
import { User } from '../users/entity/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User]),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, JwtService, ChatGateway],
})
export class ChatsModule { }
