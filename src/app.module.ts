import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './Module/users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './Module/users/user.controller';
import { UserService } from './Module/users/user.service';
import { UsersModule } from './Module/users/user.module';
import typeOrmConfig from './providers/database/db.connection';
// import { Admin } from './Module/admin/entity/admin.entity';
import { AdminModule } from './Module/admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { SellerModule } from './Module/seller/seller.module';
import { ProductModule } from './Module/product/product.module';
import { CartModule } from './Module/users/cart/cart.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OrdersModule } from './Module/orders/orders.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { Statement } from './Module/orders/statements/entity/statement.entity';
import { DeliveryBoyModule } from './Module/delievery-boy/del.module';
import { ChatsModule } from './Module/chat/chat.module';
import { ChatbotModule } from './Module/bot/bot.module';
import { EventModule } from './Module/Event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AdminModule,
    SellerModule,
    ProductModule,
    CartModule,
    OrdersModule,
    RabbitMQModule,
    DeliveryBoyModule,
    ChatsModule,
    ChatbotModule,
    EventModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{}

