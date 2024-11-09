import type { IWeatherApiService } from '../../shared/interfaces/IWeatherApiService';
import { WeatherLocation } from '../../domain/models/WeatherLocation';
import { Temperature } from '../../domain/valueObjects/Temperature';
import { WeatherGovApiService } from '../../infrastructure/externalServices/WeatherGovApiService';

export class WeatherService {
  private apiServices: IWeatherApiService[];
  private currentApiIndex: number;

  constructor(apiServices?: IWeatherApiService[]) {
    // Default to Weather.gov API if no services provided
    this.apiServices = apiServices || [new WeatherGovApiService()];
    this.currentApiIndex = 0;
  }

  async getTemperatureForLocation(
    location: WeatherLocation, 
    preferredApiName?: string
  ): Promise<Temperature> {
    // If a preferred API is specified, try to find it
    if (preferredApiName) {
      const preferredApiIndex = this.apiServices.findIndex(
        service => service.getName() === preferredApiName
      );
      
      if (preferredApiIndex !== -1) {
        try {
          return await this.apiServices[preferredApiIndex].fetchTemperature(location);
        } catch (error) {
          console.warn(`Preferred API ${preferredApiName} failed. Falling back.`);
        }
      }
    }

    // Attempt to get temperature from current API
    try {
      const temperature = await this.apiServices[this.currentApiIndex].fetchTemperature(location);
      location.setCurrentTemperature(temperature);
      return temperature;
    } catch (error) {
      // If current API fails, try the next one
      return this.fallbackToNextApi(location);
    }
  }

  private async fallbackToNextApi(location: WeatherLocation): Promise<Temperature> {
    // Cycle through available APIs
    for (let i = 0; i < this.apiServices.length; i++) {
      this.currentApiIndex = (this.currentApiIndex + 1) % this.apiServices.length;
      
      try {
        const temperature = await this.apiServices[this.currentApiIndex].fetchTemperature(location);
        location.setCurrentTemperature(temperature);
        return temperature;
      } catch (error) {
        console.warn(`API ${this.apiServices[this.currentApiIndex].getName()} failed.`);
      }
    }

    throw new Error('All weather APIs failed to retrieve temperature');
  }
}
