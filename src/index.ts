import { WeatherLocation } from './domain/models/WeatherLocation';
import { WeatherService } from './application/services/WeatherService';
import { WeatherGovApiService } from './infrastructure/externalServices/WeatherGovApiService';
import { OpenWeatherMapApiService } from './infrastructure/externalServices/OpenWeatherMapApiService';
import { InMemoryWeatherRepository } from './infrastructure/repositories/InMemoryWeatherRepository';

async function main() {
  try {
    // Create an in-memory repository
    const weatherRepository = new InMemoryWeatherRepository();

    // Create weather service with multiple API services and the repository
    const weatherService = new WeatherService(
      [
        new WeatherGovApiService(),
        new OpenWeatherMapApiService(process.env.OPENWEATHERMAP_API_KEY || '')
      ],
      weatherRepository
    );
    
    // Example locations
    const newYorkLocation = new WeatherLocation(
      40.7128, // latitude
      -74.0060, // longitude
      'New York City'
    );

    const sanFranciscoLocation = new WeatherLocation(
      37.7749, // latitude
      -122.4194, // longitude
      'San Francisco'
    );

    // Retrieve temperatures for different locations
    const newYorkTemp = await weatherService.getTemperatureForLocation(
      newYorkLocation, 
      'OpenWeatherMap API'
    );
    
    const sanFranciscoTemp = await weatherService.getTemperatureForLocation(
      sanFranciscoLocation
    );

    // Log temperatures
    console.log(`Temperature in ${newYorkLocation.getName()}: ${newYorkTemp.toString()}`);
    console.log(`Temperature in ${sanFranciscoLocation.getName()}: ${sanFranciscoTemp.toString()}`);

    // Demonstrate repository usage
    console.log('\nAll Stored Temperatures:');
    const storedTemperatures = await weatherRepository.findAll();
    storedTemperatures.forEach(entry => {
      console.log(`${entry.location.getName()}: ${entry.temperature.toString()} (Stored at: ${entry.timestamp})`);
    });

  } catch (error) {
    console.error('Failed to retrieve weather information:', error);
  }
}

main();
