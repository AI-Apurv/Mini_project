import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/Module/users/user.service';
import { User } from 'src/Module/users/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/Module/admin/entity/admin.entity';
import { DeliveryBoy } from 'src/Module/delievery-boy/entity/del.entity';
import { Userstatus } from 'src/Module/users/user.model';
import { USERRESPONSE, userResponseMessages } from 'src/common/responses/user.response';
import { ADMINRESPONSE } from 'src/common/responses/admin.response';
import { DELIVERYBOYRESPONSE } from 'src/common/responses/deliveryBoy.response';
import { Seller } from 'src/Module/seller/entity/seller.entity';
import { SELLERRESPONSE, sellerResponseMessage } from 'src/common/responses/seller.response';
import { redis } from 'src/providers/database/redis.connection';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>

  ) {

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'user_secret_key',
    })
  }


  async validate(payload: any) {
    const user = await this.userRepository.findOne({ where: { email: payload.email } })
    if (!user)
      throw new UnauthorizedException(userResponseMessages.NOT_FOUND);
    const sessionStatus = await redis.get(`${user.email}${payload.sub}`)
    if (sessionStatus == "false") throw new UnauthorizedException(USERRESPONSE.SESSION_EXPIRED)


    const userStatus = user.userStatus
    if (userStatus == Userstatus.blocked) throw new UnauthorizedException(userResponseMessages.BLOCKED)
    if (userStatus == Userstatus.deleted) throw new UnauthorizedException(userResponseMessages.DELETED)

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}




@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'adminjwt') {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'admin_secret_key',
    });
  }

  async validate(payload: any) {
    const admin = await this.adminRepository.findOne({ where: { email: payload.email } })
    if (!admin)
      throw new UnauthorizedException(ADMINRESPONSE.NOT_FOUND);
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}




@Injectable()
export class JwtDeliveryBoyStrategy extends PassportStrategy(Strategy, 'deliveryBoyjwt') {
  constructor(
    @InjectRepository(DeliveryBoy)
    private deliveryBoyRepository: Repository<DeliveryBoy>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'deliveryBoy_secret_key',
    });
  }
  async validate(payload: any) {
    const deliveryBoy = await this.deliveryBoyRepository.findOne({ where: { email: payload.email } })
    if (!deliveryBoy)
      throw new UnauthorizedException(DELIVERYBOYRESPONSE.NOT_FOUND);
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}




@Injectable()
export class JwtSellerStrategy extends PassportStrategy(Strategy, 'sellerjwt') {
  constructor( 
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'seller_secret_key',
    });
  }
  async validate(payload: any) {

    const seller = await this.sellerRepository.findOne({ where: { email: payload.email } })
    if (!seller)
      throw new UnauthorizedException(SELLERRESPONSE.NOT_FOUND);

    const isVerify = seller.verify;
    if(isVerify==false)
    throw new UnauthorizedException(sellerResponseMessage.NOT_VERIFIED)

    const sessionStatus = await redis.get(`${seller.email}${payload.sub}`)
    if (sessionStatus == "false") throw new UnauthorizedException(SELLERRESPONSE.SESSION_EXPIRED)

    return {
      sellerId: payload.sub,
      email: payload.email,
    };
  }
}


