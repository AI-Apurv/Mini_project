import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class SignupDto {
  @ApiProperty()
  @IsString()
  @Length(5, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must be at least 5 characters long and contain only letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  contactNumber: string;
}
