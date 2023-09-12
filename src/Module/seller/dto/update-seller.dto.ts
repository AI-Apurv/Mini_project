import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class UpdateSellerDto{
    
    @ApiProperty()
    name: string;
   
    @ApiProperty()
    email: string;

    @ApiProperty()
    contactNumber: string
}