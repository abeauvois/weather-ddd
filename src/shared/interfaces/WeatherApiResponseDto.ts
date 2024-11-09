export interface WeatherApiResponseDto {
  temperature: number;
  temperatureUnit: 'Celsius' | 'Fahrenheit';
  locationName?: string;
  timestamp?: Date;
}
