import { Module } from '@nestjs/common';
import { ChatbotController } from './bot.controller';
import { NlpService } from './bot.service';

@Module({
  controllers: [ChatbotController],
  providers: [NlpService],
})
export class ChatbotModule { }
