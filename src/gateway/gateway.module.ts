import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { SensorService } from 'src/sensors/services/sensors.service';
import { SensorRepository } from 'src/sensors/repositories/sensors.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema, Sensors } from 'src/schemas/sensors.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sensors.name, schema: SensorSchema }]),
  ],
  providers: [SensorService, SensorRepository, GatewayService],
})
export class GatewayModule {}
