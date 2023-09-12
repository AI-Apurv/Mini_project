import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Length,Matches } from "class-validator"

export class ResetPasswordDto {
   
    @ApiProperty()  
    @IsEmail()
    @IsNotEmpty()
    email: string 
   
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    otp: string
   
    @ApiProperty() 
    @Length(6,20)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
    })
    @IsNotEmpty()
    newPassword: string ;
}