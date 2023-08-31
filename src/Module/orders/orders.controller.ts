import { Controller, Delete, Param,Get, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as amqp from 'amqplib';
import { generatePDF } from 'src/common/pdf';
import * as nodemailer from 'nodemailer';
import { file } from 'pdfkit';
import { redis } from 'src/providers/database/redis.connection';


@ApiTags('Orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService){}


    @ApiOperation({summary: 'Get all the order details'})
    @Get('details')
    @UseGuards(JwtAuthGuard)
    async getOrderDetails(@Request() req: any){
      const userId = req.user.userId;
      const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: 'User has logged out. Please log in again.',
         };
      }
      return this.orderService.getOrderDetails(userId);
    }

    @ApiOperation({summary:'Create an order'})
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createOrder(@Request() req: any) {
      console.log('---------------------------------')
      const rabbitmqConn = await amqp.connect('amqp://localhost')
      // console.log('---------------------------------',rabbitmqConn)
      const channel = await rabbitmqConn.createChannel();
      console.log('Connection and channel created')
      const userId = req.user.userId;
      const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: 'User has logged out. Please log in again.',
         };
      }
      // console.log(userId,'userid--------------------')
     const createdOrders =  await this.orderService.createOrderForUser(userId);
     console.log('createdOrders------------------------------',createdOrders);
     const queueName = 'booking-notifications';
      const message = JSON.stringify(createdOrders);
       await channel.assertQueue(queueName);            
       channel.sendToQueue(queueName, Buffer.from(message));
       console.log('7777777777777777777777777777777777',message)
       const init = async () => {
          const rabbitMQConnection = await amqp.connect('amqp://localhost');
          const channel = await rabbitMQConnection.createChannel();
          const queueName = 'booking-notifications';                
          channel.assertQueue(queueName);                            
          channel.consume(queueName, async (message) => {
           if(!message)
            return;
            // console.log('---------------message-------------',message)
          const content=JSON.parse(message.content.toString())
          
          console.log("#######################",content);
           await generatePDF(content,'apurv1@appinventiv.com');
  
          // await sendGmail(user.email,"booking confirmation",pdfContentBase64)
          // await sendRecipient('apurv1@appinventiv.com',filepath) // Generate PDF invoice using content.userId, content.bookingId, content.email, etc.                    // await pdfGenerator.generatePDF(content);                                
          channel.ack(message); // Acknowledge the message
          console.log("--------------------------------------",channel.ack(message));
                        });
                                  };
          // init();
       console.log('message-------------------',message,'@@@@@@@@@@@@@@@@@@@@@',queueName);
      return { message: `Order created successfully.`, orders: createdOrders };
    }

    @ApiOperation({summary:'cancel the order'})
    @Delete(':orderId')
    @UseGuards(JwtAuthGuard)
    async cancelOrder(@Param('orderId') orderId: number,@Request() req:any){
      const userId = req.user.userId;
      const sessionStatus = await redis.get(userId.toString());

        if (sessionStatus === 'false') {
        return {
          message: 'User has logged out. Please log in again.',
         };
      }
      return this.orderService.cancelOrder(orderId);
    }
    
}

async function sendRecipient(email:string, filepath: any) {
      try { 
          const transporter = nodemailer.createTransport({
                  service: 'gmail',      
                  host: 'smtp.gmail.com',      
                  port: 465,      
                  secure: true,      
                  auth: {        
                    user: 'ajpatel5848@gmail.com',        
                    pass: 'eabbxcqraimxltzf',      
                  },    
                });    
                  
          const info = await transporter.sendMail({ 
                to: email,            
                subject: 'Your booking has been confirmed',           
                text: `Dear User, Your booking has been approved. Kindly refer to the attached pdf for complete details.`,         
                attachments: [{           
                  filename: 'booking_details.pdf',           
                  path: filepath,          
                },],        
              });        
              console.log('Message sent: %s', info.messageId);      
            } catch (error) {        
              console.error('Error sending email:', error);             
              throw error;  
            }}



