import { Controller, Post, Body, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { Cron } from '@nestjs/schedule';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) { }


  /**
* @author Apurv
* @description This function will used for adding event details 
* @Body CreateEventDto
* @payload name , eventDate
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enter the event details ' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto, @Request() req: any) {
    return await this.eventService.createEvent(createEventDto)
  }

}
