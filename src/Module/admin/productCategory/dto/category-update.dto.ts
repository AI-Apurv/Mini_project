import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CategoryUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  parentId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  categoryName: string;
}
