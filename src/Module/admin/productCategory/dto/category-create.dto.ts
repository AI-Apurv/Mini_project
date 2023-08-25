// category-create.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CategoryCreateDto {
 
  
  
  parentId: number

  @IsNotEmpty()
  @IsString()
  categoryName: string;
}
