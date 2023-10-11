import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sensors } from 'src/schemas/sensors.schema';
import { SensorRepository } from '../repositories/sensors.repository';
import { SENSOR_TYPE_HASH } from 'src/constants/sensorTypes.constant';

@Injectable()
export class SensorService {
  constructor(
    @InjectModel(Sensors.name)
    private readonly sensorModel: Model<Sensors>,
    private readonly sensorRepository: SensorRepository,
  ) {}

  async findAllSensors(): Promise<Sensors[]> {
    return await this.sensorRepository.findAllSensors();
  }

  async startChangeDetection(sensorId: number) {
    const sensorData = SENSOR_TYPE_HASH[sensorId];

    const res = await this.sensorRepository.findLatestDataBySensorId(
      sensorId,
      sensorData,
    );

    return res[0];
  }
}
