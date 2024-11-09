import type { WeatherApiResponseDto } from '../../shared/interfaces/WeatherApiResponseDto';

interface WeatherGovPointsResponse {
  properties: {
    forecast: string;
  };
}

interface WeatherGovForecastResponse {
  properties: {
    periods: Array<{
      temperature: number;
      temperatureUnit: 'F' | 'C';
      name?: string;
      startTime: string;
    }>;
  };
}

export class WeatherGovApiMapper {
  static mapPointsResponse(pointsData: WeatherGovPointsResponse): string {
    return pointsData.properties.forecast;
  }

  static mapForecastToDto(forecastData: WeatherGovForecastResponse): WeatherApiResponseDto {
    const firstPeriod = forecastData.properties.periods[0];
    
    return {
      temperature: firstPeriod.temperature,
      temperatureUnit: firstPeriod.temperatureUnit === 'F' ? 'Fahrenheit' : 'Celsius',
      locationName: firstPeriod.name,
      timestamp: new Date(firstPeriod.startTime)
    };
  }
}
