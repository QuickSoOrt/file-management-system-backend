import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
