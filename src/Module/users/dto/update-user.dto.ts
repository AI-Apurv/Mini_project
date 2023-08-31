import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class UpadteUserDto{
    
    @ApiProperty()
    firstName: string;
   
    @ApiProperty()
    lastName: string;

    @ApiProperty()
    contactNumber: string
}