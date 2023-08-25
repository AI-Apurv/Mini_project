// admin-update.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminUpdateDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
