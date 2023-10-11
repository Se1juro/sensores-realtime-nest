import { IsString } from 'class-validator';
import { LoginAuthValidator } from './login.validator';

export class RegisterAuthValidator extends LoginAuthValidator {
  @IsString()
  fullName: string;
}
