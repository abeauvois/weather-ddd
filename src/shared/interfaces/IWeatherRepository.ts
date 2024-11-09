import { WeatherLocation } from '../../domain/models/WeatherLocation';
import { Temperature } from '../../domain/valueObjects/Temperature';
import type { WeatherApiResponseDto } from './WeatherApiResponseDto';

export interface IWeatherRepository {
  save(location: WeatherLocation, temperature: Temperature, metadata?: WeatherApiResponseDto): Promise<void>;
  findByLocation(location: WeatherLocation): Promise<Temperature | null>;
  findAll(): Promise<Array<{location: WeatherLocation, temperature: Temperature, timestamp: Date}>>;
  clear(): Promise<void>;
}
