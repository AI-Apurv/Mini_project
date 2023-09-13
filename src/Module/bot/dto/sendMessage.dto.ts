import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class sendMessageDto{

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    message: string;
}