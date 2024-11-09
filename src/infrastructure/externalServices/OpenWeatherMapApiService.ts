import type { IWeatherApiService } from '../../shared/interfaces/IWeatherApiService';
import type { WeatherApiResponseDto } from '../../shared/interfaces/WeatherApiResponseDto';
import { Temperature } from '../../domain/valueObjects/Temperature';
import { WeatherLocation } from '../../domain/models/WeatherLocation';
import { OpenWeatherMapApiMapper } from '../mappers/OpenWeatherMapApiMapper';

interface OpenWeatherMapResponse {
  main: {
    temp: number;
  };
  name: string;
  dt: number;
}

export class OpenWeatherMapApiService implements IWeatherApiService {
  private static BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  getName(): string {
    return 'OpenWeatherMap API';
  }

  async fetchTemperature(location: WeatherLocation): Promise<Temperature> {
    try {
      const response = await fetch(
        `${OpenWeatherMapApiService.BASE_URL}?lat=${location.getLatitude()}&lon=${location.getLongitude()}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch temperature');
      }

      const data: OpenWeatherMapResponse = await response.json();
      
      // Use mapper to convert to DTO
      const weatherDto: WeatherApiResponseDto = OpenWeatherMapApiMapper.mapToDto(data);
      
      return new Temperature(
        weatherDto.temperature, 
        weatherDto.temperatureUnit
      );
    } catch (error) {
      console.error('Error fetching temperature:', error);
      throw new Error('Unable to retrieve temperature');
    }
  }
}
