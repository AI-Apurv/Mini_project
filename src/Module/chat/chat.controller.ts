import { MessageDto } from './dto/message.dto';
import { ChatsService } from './chat.service';
import { Body, Controller, Post, Request, UseGuards, Get, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';




@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) { }



  /**
* @author Apurv
* @description This function will used for creating chat
* @Body MessageDto
* @payload message , receiverId
*/
  @UseGuards(JwtAuthGuard)
  @Post()
  async createMessage(@Body() messageDto: MessageDto, @Request() req) {
    const userId = req.user.userId;
    const receiverId = messageDto.receiverId;
    return this.chatsService.createMessage(messageDto.message, userId, receiverId)
  }




  /**
* @author Apurv
* @description This function will used for getting all chat between sender and receiver
* @Param senderId , receiverId
*/
  @Get()
  async getChatsBetweenSenderAndReceiver(
    @Query('senderId') senderId: number,
    @Query('receiverId') receiverId: number,
  ) {
    const chats = await this.chatsService.getChatsBetweenSenderAndReceiver(
      senderId,
      receiverId,
    );
    return chats;
  }




  /**
* @author Apurv
* @description This function will used for getting all chat 
*/
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMessages() {
    return this.chatsService.getAllMessages()
  }




}