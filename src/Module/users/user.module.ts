import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/Middleware/jwt.strategy';
import { Session } from './entity/session.entity';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';
import { GoogleStrategy } from 'src/Middleware/google.strategy';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';




@Module({
  imports: [ ThrottlerModule.forRoot([
    {
      ttl: 2000,
      limit:1,
    }
  ]),
    TypeOrmModule.forFeature([User,Session]),
    JwtModule.register({ 
      secret: 'your_secret_key', 
      signOptions: { expiresIn: '1h' },
    }),
    CartModule,AddressModule

  ],
  controllers: [UserController],
  providers: [UserService,JwtStrategy,GoogleStrategy,
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
],
  exports: [UserService],
})
export class UsersModule {}
