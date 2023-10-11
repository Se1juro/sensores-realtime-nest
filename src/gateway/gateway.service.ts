import { UseFilters, UseInterceptors } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtExceptionFilter } from 'src/exceptions/websocket.exception';
import { WsJwtAuthInterceptor } from 'src/interceptors/jwtWebSocket.interceptor';
import { SensorService } from 'src/sensors/services/sensors.service';

@UseFilters(new WsJwtExceptionFilter())
@WebSocketGateway({ cors: { origin: '*' } })
export class GatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly sensorService: SensorService) {}

  @WebSocketServer()
  private server: Server;

  private roomIntervals: { [room: string]: NodeJS.Timeout } = {};

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @UseInterceptors(WsJwtAuthInterceptor)
  @SubscribeMessage('user_join')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    const user = client['user'];
    const room = `room_${client.id}-${user._id}-${body.sensor}`;
    client.join(room);

    const interval = setInterval(async () => {
      const data = await this.sensorService.startChangeDetection(body.sensor);
      this.server.to(room).emit('new_data_sensor', data);
    }, 6000); // 6 Sec

    this.roomIntervals[room] = interval;
  }

  @SubscribeMessage('user_leave')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    const room = `room_${client.id}-${body.userId}-${body.sensor}`;
    client.leave(room);

    if (this.roomIntervals[room]) {
      clearInterval(this.roomIntervals[room]);
      delete this.roomIntervals[room];
    }

    console.log('Client disconnected');
  }
}
