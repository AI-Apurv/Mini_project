import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/Middleware/jwt.strategy';
import { Session } from './entity/session.entity';
import { CartModule } from './cart/cart.module';




@Module({
  imports: [
    TypeOrmModule.forFeature([User,Session]),
    JwtModule.register({ // Add JwtModule configuration
      secret: 'your_secret_key', // Replace with your actual secret key
      signOptions: { expiresIn: '1h' }, // Adjust token expiration as needed
    }),
    CartModule

  ],
  controllers: [UserController],
  providers: [UserService,JwtStrategy,],
  exports: [UserService],
})
export class UsersModule {}
