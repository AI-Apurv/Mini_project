import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateDto {

 
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;


}
