import { WeatherLocation } from '../../domain/models/WeatherLocation';
import { Temperature } from '../../domain/valueObjects/Temperature';
import type { IWeatherRepository } from '../../shared/interfaces/IWeatherRepository';
import type { WeatherApiResponseDto } from '../../shared/interfaces/WeatherApiResponseDto';

interface WeatherEntry {
  location: WeatherLocation;
  temperature: Temperature;
  metadata?: WeatherApiResponseDto;
  timestamp: Date;
}

export class InMemoryWeatherRepository implements IWeatherRepository {
  private storage: WeatherEntry[] = [];

  async save(
    location: WeatherLocation, 
    temperature: Temperature, 
    metadata?: WeatherApiResponseDto
  ): Promise<void> {
    // Remove existing entry for the same location if it exists
    this.storage = this.storage.filter(
      entry => entry.location.getLatitude() !== location.getLatitude() || 
               entry.location.getLongitude() !== location.getLongitude()
    );

    // Add new entry
    this.storage.push({
      location,
      temperature,
      metadata,
      timestamp: new Date()
    });
  }

  async findByLocation(location: WeatherLocation): Promise<Temperature | null> {
    const entry = this.storage.find(
      entry => entry.location.getLatitude() === location.getLatitude() && 
               entry.location.getLongitude() === location.getLongitude()
    );

    return entry ? entry.temperature : null;
  }

  async findAll(): Promise<Array<{location: WeatherLocation, temperature: Temperature, timestamp: Date}>> {
    return this.storage.map(entry => ({
      location: entry.location,
      temperature: entry.temperature,
      timestamp: entry.timestamp
    }));
  }

  async clear(): Promise<void> {
    this.storage = [];
  }

  // Additional method to get entries within a specific time window
  async findRecentEntries(maxAgeMinutes: number = 30): Promise<WeatherEntry[]> {
    const cutoffTime = new Date(Date.now() - maxAgeMinutes * 60000);
    
    return this.storage.filter(
      entry => entry.timestamp >= cutoffTime
    );
  }
}
