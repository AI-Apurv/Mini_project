import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CartUpdateDto {
    
    @ApiProperty()
    @IsOptional()
    productId: number;

    @ApiProperty()
    @IsOptional()
    quantity: number;
  }
  