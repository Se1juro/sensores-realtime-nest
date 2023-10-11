import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sensors } from '../../schemas/sensors.schema';

@Injectable()
export class SensorRepository {
  constructor(
    @InjectModel(Sensors.name) private readonly sensorModel: Model<Sensors>,
  ) {}

  findAllSensors() {
    /*     return this.sensorModel.aggregate([
      {
        $project: {
          _id: 0,
          sensorId: '$sensor_id',
          sensorName: '$sensor_name',
        },
      },
    ]); */
    return this.sensorModel.find({}, { data: 0 }).exec();
  }

  findLatestDataBySensorId(sensorId: number, sensorData: any) {
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

  getDataVariable(sensorId: number) {
    return this.sensorModel
      .findOne({ sensor_id: sensorId }, { _id: 0, data: 1 })
      .exec();
  }
}
