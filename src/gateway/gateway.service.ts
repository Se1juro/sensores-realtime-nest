import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { SensorService } from 'src/sensors/services/sensors.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GatewayService implements OnModuleInit {
  constructor(private readonly sensorService: SensorService) {}
  @WebSocketServer()
  private server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('user_join')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    const room = `room_${client.id}-${body.userId}-${body.sensor}`;
    client.join(room);

    setInterval(async () => {
      const data = await this.sensorService.startChangeDetection(body.sensor);
      this.server.to(room).emit('new_data_sensor', data);
    }, 6000); // 6 Sec
  }
}
