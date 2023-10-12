import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterAuthValidator } from '../validators/register.validator';
import { AuthService } from '../services/auth.service';
import { LoginAuthValidator } from '../validators/login.validator';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { CurrentUser } from 'src/decorator/currentUser.decortator';
import { ISession } from 'src/interfaces/session.interface';

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

  @UseGuards(JwtAuthGuard)
  @Get('/check')
  checkAuth(@CurrentUser() user: ISession) {
    const { _id, fullName, userName } = user;
    return { logged: true, user: { _id, fullName, userName } };
  }
}
