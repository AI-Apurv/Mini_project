import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class SignupDto {
  @IsString()
  @Length(5, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must be at least 5 characters long and contain only letters, numbers, and underscores',
  })
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  })
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  contactNumber: string;
}
