import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Sensors } from 'src/schemas/sensors.schema';
import { SensorService } from '../services/sensors.service';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';

@Controller('sensors')
@UseGuards(JwtAuthGuard)
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  private operationHandlers = {
    average: (sensorId: number, variable: string) =>
      this.sensorService.calculateAverageVariable(sensorId, variable),
    standardDeviation: (sensorId: number, variable: string) =>
      this.sensorService.calculateStandardDeviation(sensorId, variable),
    trend: (sensorId: number, variable: string) =>
      this.sensorService.calculateTrend(sensorId, variable),
  };

  @Get()
  async findAllSensors(): Promise<Sensors[]> {
    return this.sensorService.findAllSensors();
  }

  @Get('/:operation/:sensorId/:variable')
  async getAverage(
    @Param('operation') operation: string,
    @Param('sensorId', ParseIntPipe) id: number,
    @Param('variable') variable: string,
  ) {
    return this.operationHandlers[operation](id, variable);
  }
}
