import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Sensors extends Document {
  @Prop({ required: true })
  sensor_id: number;

  @Prop({ required: true })
  sensor_name: string;

  @Prop([mongoose.Schema.Types.Mixed]) // Schema.types.mixed is any declaration
  data: any[];
}

export const SensorSchema = SchemaFactory.createForClass(Sensors);
