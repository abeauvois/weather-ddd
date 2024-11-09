import { WeatherLocation } from './domain/models/WeatherLocation';
import { WeatherService } from './application/services/WeatherService';
import { WeatherGovApiService } from './infrastructure/externalServices/WeatherGovApiService';
import { OpenWeatherMapApiService } from './infrastructure/externalServices/OpenWeatherMapApiService';

async function main() {
  try {
    // Example location (New York City coordinates)
    const newYorkLocation = new WeatherLocation(
      40.7128, // latitude
      -74.0060, // longitude
      'New York City'
    );

    // Create weather service with multiple API services
    const weatherService = new WeatherService([
      new WeatherGovApiService(),
      new OpenWeatherMapApiService(process.env.OPENWEATHERMAP_API_KEY || '')
    ]);
    
    // Try to get temperature, optionally specifying a preferred API
    const temperature = await weatherService.getTemperatureForLocation(
      newYorkLocation, 
      'OpenWeatherMap API' // Optional: specify preferred API
    );
    
    console.log(`Temperature in ${newYorkLocation.getName()}: ${temperature.toString()}`);
  } catch (error) {
    console.error('Failed to retrieve weather information:', error);
  }
}

main();
