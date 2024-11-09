import type { WeatherApiResponseDto } from '../../shared/interfaces/WeatherApiResponseDto';

interface OpenWeatherMapResponse {
  main: {
    temp: number;
  };
  name: string;
  dt: number;
}

export class OpenWeatherMapApiMapper {
  static mapToDto(data: OpenWeatherMapResponse): WeatherApiResponseDto {
    return {
      temperature: data.main.temp,
      temperatureUnit: 'Celsius',
      locationName: data.name,
      timestamp: new Date(data.dt * 1000)
    };
  }
}
