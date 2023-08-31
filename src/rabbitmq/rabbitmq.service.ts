// rabbitmq.service.ts
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import rabbitmqConfig from 'src/rabbitmq.config';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.connect();
  }

  async connect() {
    this.connection = await amqp.connect(rabbitmqConfig.uri);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(rabbitmqConfig.queueName, { durable: true });
  }

  async sendMessage(message: string) {
    this.channel.sendToQueue(rabbitmqConfig.queueName, Buffer.from(message), { persistent: true });
  }

  async receiveMessage(callback: (message: string) => void) {
    this.channel.consume(rabbitmqConfig.queueName, (message) => {
      if (message !== null) {
        callback(message.content.toString());
        this.channel.ack(message);
      }
    });
  }

  async closeConnection() {
    await this.channel.close();
    await this.connection.close();
  }
}
