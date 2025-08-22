import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  readonly email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
