import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sensors } from '../../schemas/sensors.schema';

@Injectable()
export class SensorRepository {
  constructor(
    @InjectModel(Sensors.name) private readonly sensorModel: Model<Sensors>,
  ) {}

  async findLatestDataBySensorId(sensorId: number, sensorData: any) {
    return this.sensorModel
      .aggregate([
        {
          $match: {
            sensor_id: sensorId,
          },
        },
        {
          $project: {
            lastData: {
              $arrayElemAt: [
                {
                  $slice: ['$data', -1],
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            timestamp: '$lastData.timestamp',
            ...sensorData,
          },
        },
      ])
      .exec();
  }
}
