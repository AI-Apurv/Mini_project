import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log(ExtractJwt.fromAuthHeaderAsBearerToken());
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_secret_key',
    });
  }

  async validate(payload: any) {
    return {
      // id: payload.userId,//new change
      userId: payload.sub,
      email: payload.email,
      role: payload.role  //add when admin
      
    };
  }

  // async adminValidate(payload: any){
  //   return {
  //     id: payload.sub,
  //     email: payload.email,
  //     role: payload.role
  //   }
  // }
}