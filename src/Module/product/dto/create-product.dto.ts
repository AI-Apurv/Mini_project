import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  // @IsOptional()
  // image: string | null

  // @IsOptional()
  // image: Buffer | null

  @ApiProperty()
  @IsOptional()
  image: Express.Multer.File

  // Image: string //correct 

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
   
  
}
