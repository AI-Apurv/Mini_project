import { Controller, Post, Body } from '@nestjs/common';
import { NlpService } from './bot.service';
import { sendMessageDto } from './dto/sendMessage.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly nlpService: NlpService) {}

  @Post('ask')
  async ask(@Body() sendMessageDto: sendMessageDto) {
    const { answer } = await this.nlpService.process(sendMessageDto.message);
    return { answer };
  }
}
