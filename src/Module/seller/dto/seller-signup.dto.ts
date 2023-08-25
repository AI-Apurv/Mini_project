// seller-signup.dto.ts
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class SellerSignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  contactNumber: string
}
