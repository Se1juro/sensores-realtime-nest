import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/schemas/users.schema';
import { RegisterAuthValidator } from '../validators/register.validator';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
  ) {}

  createUser(user: RegisterAuthValidator) {
    return this.userModel.create(user);
  }

  findUserByUserName(userName: string) {
    return this.userModel.findOne({ userName }, { __v: 0 });
  }
}
