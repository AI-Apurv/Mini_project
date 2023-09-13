import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class verifyEmailOtp{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    otp: string;
    
}