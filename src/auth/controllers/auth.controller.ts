import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAuthValidator } from '../validators/register.validator';
import { AuthService } from '../services/auth.service';
import { LoginAuthValidator } from '../validators/login.validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  registerUser(@Body() user: RegisterAuthValidator) {
    return this.authService.registerUser(user);
  }

  @Post('/login')
  loginUser(@Body() user: LoginAuthValidator) {
    return this.authService.loginUser(user);
  }
}
