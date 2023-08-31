// category-create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CategoryCreateDto {
 
  
  @ApiProperty()
  parentId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryName: string;
}
