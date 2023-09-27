import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdminUpdateDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;
}
