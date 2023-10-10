import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsModule } from './sensors/sensors.module';
import { ConfigModule } from '@nestjs/config';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // In production use .env
    MongooseModule.forRoot('mongodb://localhost:27017/sensores-nest'),
    SensorsModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
