import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty, Length, Matches } from 'class-validator';

export class UserChangePasswordDto {
  
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 20)
  oldPassword: string;

  
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  })
  newPassword: string;
}
