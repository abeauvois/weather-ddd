export class Temperature {
  private readonly value: number;
  private readonly unit: 'Celsius' | 'Fahrenheit';

  constructor(value: number, unit: 'Celsius' | 'Fahrenheit') {
    if (value === undefined || value === null) {
      throw new Error('Temperature value is required');
    }
    this.value = value;
    this.unit = unit;
  }

  getValue(): number {
    return this.value;
  }

  getUnit(): string {
    return this.unit;
  }

  // Method to convert between units if needed
  convertTo(targetUnit: 'Celsius' | 'Fahrenheit'): Temperature {
    if (this.unit === targetUnit) return this;

    const convertedValue = this.unit === 'Celsius' 
      ? (this.value * 9/5) + 32 
      : (this.value - 32) * 5/9;

    return new Temperature(convertedValue, targetUnit);
  }

  toString(): string {
    return `${this.value}°${this.unit === 'Celsius' ? 'C' : 'F'}`;
  }
}
