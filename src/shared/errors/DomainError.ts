export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    
    // This ensures that the prototype is set correctly in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TemperatureError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class LocationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
