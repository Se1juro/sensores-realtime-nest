import { BadRequestException, Injectable } from '@nestjs/common';
import { Sensors } from 'src/schemas/sensors.schema';
import { SensorRepository } from '../repositories/sensors.repository';
import { SENSOR_TYPE_HASH } from 'src/constants/sensorTypes.constant';
import { DataPoint, linear } from 'regression';
@Injectable()
export class SensorService {
  constructor(private readonly sensorRepository: SensorRepository) {}

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

  async calculateAverageVariable(sensorId: number, variable: string) {
    const dataSensor = await this.sensorRepository.getDataVariable(sensorId);

    const { data } = dataSensor;

    if (data.some((value) => !(variable in value)))
      throw new BadRequestException('Variable not exits in this sensor');

    let sum = 0;

    data.forEach((value) => (sum += value[variable]));

    const average = sum / data.length;

    return {
      variable,
      average,
    };
  }

  async calculateStandardDeviation(sensorId: number, variable: string) {
    const dataSensor = await this.sensorRepository.getDataVariable(sensorId);

    const { data } = dataSensor;
    if (data.some((value) => !(variable in value)))
      throw new BadRequestException('Variable not exits in this sensor');

    const newValuesFromVariable = data.map((value) => value[variable]);

    const average =
      newValuesFromVariable.reduce((sum, valor) => sum + valor, 0) /
      data.length;

    // Subtract the average from each individual value and square
    const differencesSquared = newValuesFromVariable.map((value) =>
      Math.pow(value - average, 2),
    );

    // Calculate the average of the squared differences
    const variance =
      differencesSquared.reduce((sum, difference) => sum + difference, 0) /
      newValuesFromVariable.length;

    // Take the square root of the variance to get the standard deviation
    const standardDeviation = Math.sqrt(variance);

    return { variable, standardDeviation };
  }

  async calculateTrend(sensorId: number, variable: string) {
    const dataSensor = await this.sensorRepository.getDataVariable(sensorId);
    const { data } = dataSensor;

    if (data.some((value) => !(variable in value))) {
      throw new BadRequestException('Variable does not exist in this sensor');
    }

    const timestamps: number[] = data.map((item) => item.timestamp);

    const variableValues: number[] = data.map((item) => item[variable]);

    const valuesTest: DataPoint[] = data.map((item) => [
      item.timestamp,
      item[variable],
    ]);

    const result = linear(valuesTest);
    const slope = result.equation[0];

    return {
      slope,
      trend: slope < 0 ? 'decreasing' : 'increasing',
      description: `El análisis de los datos muestra una tendencia ${
        slope < 0 ? 'decreciente' : 'creciente'
      } en la variable ${variable} a lo largo del tiempo.`,
      labels: timestamps,
      dataSet: variableValues,
    };
  }
}
