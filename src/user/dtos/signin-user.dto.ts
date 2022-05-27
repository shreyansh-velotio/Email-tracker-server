import { IsNotEmpty, IsString } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
