
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({ required: false })
    @IsString()
    name: string;
  
    @ApiProperty({ required: false })
    @IsNumber()
    @IsPositive()
    quantity: number;
  
    @ApiProperty({ required: false })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ required: false })
    @IsNumber()
    categoryId: number;
     
}
