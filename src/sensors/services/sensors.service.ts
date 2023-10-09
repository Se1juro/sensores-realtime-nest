import { Injectable } from '@nestjs/common';
import { SensorRepository } from '../repositories/sensors.repository';
import { Sensors } from 'src/schemas/sensors.schema';

@Injectable()
export class SensorService {
  constructor(private readonly sensorRepository: SensorRepository) {}

  async findAllSensors(): Promise<Sensors[]> {
    return await this.sensorRepository.findAll();
  }
}
