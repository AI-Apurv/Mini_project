import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class FilterProductDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  minPrice: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  maxPrice: number;

  
}
