import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Injectable()
export class MyService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async sendMessage(message: string) {
    await this.rabbitMQService.sendMessage(message);
  }

  async startConsuming() {
    this.rabbitMQService.receiveMessage((message) => {
      console.log('Received:', message);
    });
  }

  async stopConsuming() {
    await this.rabbitMQService.closeConnection();
  }
}
