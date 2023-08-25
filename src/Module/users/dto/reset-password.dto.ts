import { IsEmail, IsString } from "class-validator"

export class ResetPasswordDto {
    
    @IsEmail()
    email: string 

    @IsString()
    otp: string

    @IsEmail() 
    newPassword: string 
}