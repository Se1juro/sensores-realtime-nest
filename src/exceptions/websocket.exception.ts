import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(UnauthorizedException)
export class WsJwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    const errorResponse = 'User not authenticate';

    client.emit('exception', new WsException(errorResponse));
  }
}
