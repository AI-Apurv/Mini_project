import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
export class JwtAdminAuthGuard extends AuthGuard('adminjwt') { }
export class JwtDeliveryBoyAuthGuard extends AuthGuard('deliveryBoyjwt') { }
export class JwtSellerAuthGuard extends AuthGuard('sellerjwt') { }

