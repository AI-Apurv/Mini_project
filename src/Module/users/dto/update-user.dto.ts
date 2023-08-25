import { IsNotEmpty } from "class-validator";

export class UpadteUserDto{
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;
}