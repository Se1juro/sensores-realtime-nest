import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { JWT_CONSTANT } from 'src/constants/auth.constant';

@Injectable()
export class WsJwtAuthInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client: Socket = context.switchToWs().getClient();
    const data = context.switchToWs().getData();
    const token = data.token;

    try {
      const user = this.jwtService.verify(token, { secret: JWT_CONSTANT });
      client['user'] = user._doc;
    } catch (e) {
      client.emit('exception', new WsException('User not authenticate'));
      client.disconnect();
    }

    return next.handle();
  }
}
