import { Controller, Get } from '@nestjs/common';
import { Sensors } from 'src/schemas/sensors.schema';
import { SensorService } from '../services/sensors.service';

@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  async findAllSensors(): Promise<Sensors[]> {
    return this.sensorService.findAllSensors();
  }
}
