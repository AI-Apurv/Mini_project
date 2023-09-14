import { Controller, Post, Body,Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { Cron } from '@nestjs/schedule';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}
  
  @ApiBearerAuth()
  @ApiOperation({summary: 'Enter the event details '})
  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto, @Request() req:any){
    const role = req.user.role;
    console.log(role)
    if(role!=='admin')
    {
      throw new HttpException('You are not authorized to perform this action', HttpStatus.UNAUTHORIZED);
    }
    return await this.eventService.createEvent(createEventDto)
  }

}
