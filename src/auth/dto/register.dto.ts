import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  public readonly email!: string;

  @IsString()
  @MinLength(6)
  public readonly password!: string;
}
