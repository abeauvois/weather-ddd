import { WeatherLocation } from '../../domain/models/WeatherLocation';
import { Temperature } from '../../domain/valueObjects/Temperature';

export interface IWeatherApiService {
  fetchTemperature(location: WeatherLocation): Promise<Temperature>;
  getName(): string;
}
