import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsString } from "class-validator";

export class verifyContactDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    contactNumber: string;
}