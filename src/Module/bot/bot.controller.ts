import { Controller, Post, Body } from '@nestjs/common';
import { NlpService } from './bot.service';
import { sendMessageDto } from './dto/sendMessage.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly nlpService: NlpService) { }




  
  /**
* @author Apurv
* @description This function will used be used by user to get answer of FAQs
* @Body sendMessageDto
* @payload message
*/
  @Post('ask')
  async ask(@Body() sendMessageDto: sendMessageDto) {
    const { answer } = await this.nlpService.process(sendMessageDto.message);
    return { answer };
  }
}
