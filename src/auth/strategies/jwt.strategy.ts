import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JWT_CONSTANT } from 'src/constants/auth.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT,
    });
  }

  async validate(payload: any) {
    const { _doc } = payload;

    return {
      _id: _doc._id,
      userName: _doc.userName,
      fullName: _doc.fullName,
    };
  }
}
