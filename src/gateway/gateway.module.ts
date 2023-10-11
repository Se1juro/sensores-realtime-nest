import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { SensorService } from 'src/sensors/services/sensors.service';
import { SensorRepository } from 'src/sensors/repositories/sensors.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema, Sensors } from 'src/schemas/sensors.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sensors.name, schema: SensorSchema }]),
  ],
  providers: [SensorService, SensorRepository, GatewayService, JwtService],
})
export class GatewayModule {}
