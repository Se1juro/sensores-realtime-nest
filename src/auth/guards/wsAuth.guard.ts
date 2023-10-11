import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client: Socket = context.switchToWs().getClient();
    return client.handshake;
  }
}
