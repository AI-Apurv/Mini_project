import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, Length, Matches } from "class-validator"

export class ResetPasswordDto {

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  otp: string

  @ApiProperty()
  @Length(6, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  })
  newPassword: string;
}