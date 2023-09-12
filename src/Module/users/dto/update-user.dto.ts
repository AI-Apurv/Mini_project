import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length, isString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class UpadteUserDto{
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    firstName: string;
   
    @ApiProperty()
    @IsString()
    @IsOptional()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @Length(10,10,{message: 'Invalid contact number format. It should be 10 digit long '})
    @IsNumberString({no_symbols:true}, {message:'Contact number can only contain numbers'})
    contactNumber: string
}