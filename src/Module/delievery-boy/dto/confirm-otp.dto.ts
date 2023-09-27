import { IsEmail, IsNotEmpty, IsNumberString, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class ConfirmOTP {

 @ApiProperty()
 @IsNotEmpty()
 @IsString()
 otp: string


}
