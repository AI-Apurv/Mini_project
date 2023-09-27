import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event } from './entity/event.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { User } from '../users/entity/user.entity';
@Module({
  imports: [ScheduleModule.forRoot(),
  TypeOrmModule.forFeature([Event, User])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule { }
