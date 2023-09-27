import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Event } from './entity/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { format, addMinutes } from 'date-fns';
import { User } from '../users/entity/user.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }




  //-----------------------------send event reminder email 24 hour ago to user--------------------------------
  //   @Cron('* * * * *') 
  //   async checkEventDates() {
  //   const currentDate = new Date();
  //   currentDate.setMilliseconds(0);

  //   const istOptions = {
  //     timeZone: 'Asia/Kolkata',
  //     hour12: false, // Use 24-hour format
  //   };

  //   // Format the currentDate in IST
  //   const currentDateIST = currentDate.toLocaleString('en-IN', istOptions);


  //   const oneDayLater = new Date(currentDate);
  //   oneDayLater.setMinutes(oneDayLater.getMinutes()+1440);
  //   oneDayLater.setMilliseconds(0);

  //   const oneDayLaterIST = oneDayLater.toLocaleString('en-IN', istOptions);


  //   try {
  //     const events = await this.eventRepository.find({
  //       where: {
  //         eventDate: oneDayLaterIST,
  //       },
  //     });

  //     const users = await this.userRepository.find();
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       host: 'smtp.gmail.com',
  //       port: 465,
  //       secure: true,
  //       auth: {
  //         user: 'apurv1@appinventiv.com',
  //         pass: 'atldfmccuufdvqzm',
  //       },
  //     });
  //     events.forEach(async (event: Event) => {
  //       const eventNames = events.map((event) => event.name).join(', '); 

  //       users.forEach(async (user) => {
  //         const mailOptions = {
  //           from: process.env.EMAIL,
  //           to: user.email,
  //           subject: 'Event Reminder',
  //           text: `Dear ,\n\nThe following event(s) are happening tomorrow: ${eventNames}\n\nSincerely, Your Event Team`,
  //         };

  //         try {
  //           await transporter.sendMail(mailOptions);
  //           console.log(`Event names sent to ${user.email}`);
  //         } catch (error) {
  //           console.error('Error sending email:', error);
  //           throw new InternalServerErrorException('Error sending email');
  //         }
  //       });
  //     });
  //   } catch (error) {
  //     console.error('Error checking event dates:', error);
  //   }
  // }




  //---------------------------------------send event started email to user---------------------------------
  // @Cron('* * * * *') 
  // async EventStarted() {
  // const currentDate = new Date();
  // currentDate.setMilliseconds(0);

  // const istOptions = {
  //   timeZone: 'Asia/Kolkata',
  //   hour12: false, // Use 24-hour format
  // };

  // // Format the currentDate in IST
  // const currentDateIST = currentDate.toLocaleString('en-IN', istOptions);

  // try {
  //   const events = await this.eventRepository.find({
  //     where: {
  //       eventDate: currentDateIST,
  //     },
  //   });

  //   const users = await this.userRepository.find();
  //   const transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     host: 'smtp.gmail.com',
  //     port: 465,
  //     secure: true,
  //     auth: {
  //       user: 'apurv1@appinventiv.com',
  //       pass: 'atldfmccuufdvqzm',
  //     },
  //   });
  //   events.forEach(async (event: Event) => {
  //     const eventNames = events.map((event) => event.name).join(', '); 

  //     users.forEach(async (user) => {
  //       const mailOptions = {
  //         from: process.env.EMAIL,
  //         to: user.email,
  //         subject: 'Event Reminder',
  //         text: `Dear ,\n\nThe following event has started: ${eventNames}\n\nSincerely, Company Name`,
  //       };

  //       try {
  //         await transporter.sendMail(mailOptions);
  //         console.log(`Event details sent to ${user.email}`);
  //       } catch (error) {
  //         console.error('Error sending email:', error);
  //         throw new InternalServerErrorException('Error sending email');
  //       }
  //     });
  //   });
  // } catch (error) {
  //   console.error('Error checking event dates:', error);
  // }
  // }
  //-----------------------------------------------------------------------------------------




  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = new Event();
    event.name = createEventDto.name;
    event.eventDate = createEventDto.eventDate;
    return await this.eventRepository.save(event);
  }

}
