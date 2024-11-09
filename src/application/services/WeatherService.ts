import type { IWeatherApiService } from '../../shared/interfaces/IWeatherApiService';
import type { IWeatherRepository } from '../../shared/interfaces/IWeatherRepository';
import { WeatherLocation } from '../../domain/models/WeatherLocation';
import { Temperature } from '../../domain/valueObjects/Temperature';
import { WeatherGovApiService } from '../../infrastructure/externalServices/WeatherGovApiService';
import { InMemoryWeatherRepository } from '../../infrastructure/repositories/InMemoryWeatherRepository';

export class WeatherService {
  private apiServices: IWeatherApiService[];
  private currentApiIndex: number;
  private repository: IWeatherRepository;

  constructor(
    apiServices?: IWeatherApiService[], 
    repository?: IWeatherRepository
  ) {
    // Default to Weather.gov API if no services provided
    this.apiServices = apiServices || [new WeatherGovApiService()];
    this.currentApiIndex = 0;
    
    // Use provided repository or create an in-memory one
    this.repository = repository || new InMemoryWeatherRepository();
  }

  async getTemperatureForLocation(
    location: WeatherLocation, 
    preferredApiName?: string
  ): Promise<Temperature> {
    // First, check if we have a recent cached result
    const cachedTemperature = await this.repository.findByLocation(location);
    
    if (cachedTemperature) {
      console.log('Using cached temperature');
      return cachedTemperature;
    }

    // If no cached result, fetch from API
    let temperature: Temperature;

    // If a preferred API is specified, try to find it
    if (preferredApiName) {
      const preferredApiIndex = this.apiServices.findIndex(
        service => service.getName() === preferredApiName
      );
      
      if (preferredApiIndex !== -1) {
        try {
          temperature = await this.apiServices[preferredApiIndex].fetchTemperature(location);
        } catch (error) {
          console.warn(`Preferred API ${preferredApiName} failed. Falling back.`);
          temperature = await this.fallbackToNextApi(location);
        }
      } else {
        temperature = await this.fallbackToNextApi(location);
      }
    } else {
      temperature = await this.fallbackToNextApi(location);
    }

    // Save the retrieved temperature to the repository
    await this.repository.save(location, temperature);

    return temperature;
  }

  private async fallbackToNextApi(location: WeatherLocation): Promise<Temperature> {
    // Cycle through available APIs
    for (let i = 0; i < this.apiServices.length; i++) {
      this.currentApiIndex = (this.currentApiIndex + 1) % this.apiServices.length;
      
      try {
        const temperature = await this.apiServices[this.currentApiIndex].fetchTemperature(location);
        return temperature;
      } catch (error) {
        console.warn(`API ${this.apiServices[this.currentApiIndex].getName()} failed.`);
      }
    }

    throw new Error('All weather APIs failed to retrieve temperature');
  }
}
