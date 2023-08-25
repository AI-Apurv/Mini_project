// seller-login.dto.ts
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class SellerLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
