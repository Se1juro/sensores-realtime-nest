import { Module } from '@nestjs/common';
import { SensorService } from './services/sensors.service';
import { SensorController } from './controllers/sensors.controller';
import { SensorRepository } from './repositories/sensors.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Sensors, SensorSchema } from 'src/schemas/sensors.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sensors.name, schema: SensorSchema }]),
  ],
  controllers: [SensorController],
  providers: [SensorService, SensorRepository],
})
export class SensorsModule {}
