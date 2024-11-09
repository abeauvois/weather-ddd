import { Temperature } from '../valueObjects/Temperature';

export class WeatherLocation {
  private readonly latitude: number;
  private readonly longitude: number;
  private readonly name: string;
  private currentTemperature?: Temperature;

  constructor(
    latitude: number, 
    longitude: number, 
    name: string
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
  }

  getLatitude(): number {
    return this.latitude;
  }

  getLongitude(): number {
    return this.longitude;
  }

  getName(): string {
    return this.name;
  }

  setCurrentTemperature(temperature: Temperature): void {
    this.currentTemperature = temperature;
  }

  getCurrentTemperature(): Temperature | undefined {
    return this.currentTemperature;
  }
}
