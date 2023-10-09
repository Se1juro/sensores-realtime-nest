import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsModule } from './sensors/sensors.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/sensores-nest'),
    SensorsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
