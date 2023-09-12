import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateAddressDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  street: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  postalCode: string;
}
