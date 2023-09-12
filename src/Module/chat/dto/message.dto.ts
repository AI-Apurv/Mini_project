import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MessageDto {
    @ApiProperty()
    @IsString()
    message: string

    @ApiProperty()
    @IsNumber()
    receiverId: number;

}