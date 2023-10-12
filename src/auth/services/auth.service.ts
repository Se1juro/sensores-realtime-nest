import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterAuthValidator } from '../validators/register.validator';
import { compare, hash } from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { LoginAuthValidator } from '../validators/login.validator';
import { Users } from 'src/schemas/users.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async registerUser(user: RegisterAuthValidator) {
    const { password } = user;

    const hashPassword = await hash(password, 10);

    const userToSave = { ...user, password: hashPassword };

    const userCreated = await this.authRepository.createUser(userToSave);

    userCreated.password = undefined;

    return {
      user: userCreated,
      token: this.generateToken(userCreated),
    };
  }

  async loginUser(user: LoginAuthValidator) {
    const { userName, password } = user;
    const userExits = await this.authRepository.findUserByUserName(userName);

    if (!userExits) throw new NotFoundException("User doesn't exits");

    const checkPassword = await compare(password, userExits.password);

    if (!checkPassword) throw new ForbiddenException('Password incorrect');

    const token = this.generateToken(userExits);

    userExits.password = undefined;

    return { user: userExits, token };
  }

  generateToken(dataUser: Users) {
    return this.jwtService.sign({ ...dataUser });
  }
}
