export const SENSOR_TYPE_HASH = {
  1: {
    temperature: '$lastData.temperature',
    humidity: '$lastData.humidity',
  },
  2: {
    pressure: '$lastData.pressure',
    windSpeed: '$lastData.wind_speed',
  },
  3: {
    noiseLevel: '$lastData.noise_level',
    airQuality: '$lastData.air_quality',
  },
};
