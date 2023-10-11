import { IsString, IsStrongPassword } from 'class-validator';

export class LoginAuthValidator {
  @IsString()
  userName: string;

  @IsStrongPassword()
  password: string;
}
