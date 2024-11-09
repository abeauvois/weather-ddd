import type { IWeatherApiService } from '../../shared/interfaces/IWeatherApiService';
import type { WeatherApiResponseDto } from '../../shared/interfaces/WeatherApiResponseDto';
import { Temperature } from '../../domain/valueObjects/Temperature';
import { WeatherLocation } from '../../domain/models/WeatherLocation';
import { WeatherGovApiMapper } from '../mappers/WeatherGovApiMapper';

interface WeatherApiResponse {
  properties: {
    forecast: string;
  };
}

interface ForecastResponse {
  properties: {
    periods: Array<{
      temperature: number;
      temperatureUnit: 'F' | 'C';
      name?: string;
      startTime: string;
    }>;
  };
}

export class WeatherGovApiService implements IWeatherApiService {
  private static BASE_URL = 'https://api.weather.gov';

  getName(): string {
    return 'Weather.gov API';
  }

  async fetchTemperature(location: WeatherLocation): Promise<Temperature> {
    try {
      // First, get the forecast endpoint for the specific location
      const pointsResponse = await fetch(
        `${WeatherGovApiService.BASE_URL}/points/${location.getLatitude()},${location.getLongitude()}`
      );

      if (!pointsResponse.ok) {
        throw new Error('Failed to fetch location details');
      }

      const pointsData: WeatherApiResponse = await pointsResponse.json();
      const forecastUrl = WeatherGovApiMapper.mapPointsResponse(pointsData);

      // Then, fetch the actual forecast using the endpoint from the previous response
      const forecastResponse = await fetch(forecastUrl);

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast');
      }

      const forecastData: ForecastResponse = await forecastResponse.json();
      
      // Use mapper to convert to DTO
      const weatherDto: WeatherApiResponseDto = WeatherGovApiMapper.mapForecastToDto(forecastData);
      
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
