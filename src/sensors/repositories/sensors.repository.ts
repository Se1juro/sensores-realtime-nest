import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sensors } from '../../schemas/sensors.schema';

@Injectable()
export class SensorRepository {
  constructor(
    @InjectModel(Sensors.name) private readonly sensorModel: Model<Sensors>,
  ) {}

  async findAll(): Promise<Sensors[]> {
    return this.sensorModel.find().exec();
  }
}
