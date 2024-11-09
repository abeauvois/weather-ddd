# Weather DDD Application

## Overview
This is a TypeScript-based Weather Application implemented using Domain-Driven Design (DDD) principles. The application provides weather information by integrating multiple weather API services and following clean architecture practices.

## Project Structure
```
src/
├── application/         # Application layer (use cases, services)
│   └── services/
├── domain/              # Domain layer (core business logic)
│   ├── models/          # Domain entities
│   └── valueObjects/    # Immutable value objects
├── infrastructure/      # Infrastructure layer
│   ├── externalServices/  # External API integrations
│   ├── mappers/         # Data transformation mappers
│   └── repositories/    # Data persistence implementations
└── shared/              # Shared kernel
    ├── errors/          # Domain-specific error handling
    └── interfaces/      # Shared interfaces and DTOs
```

## Key Components
- **Domain Layer**: Defines core business logic and value objects
- **Application Layer**: Implements use cases and coordinates domain objects
- **Infrastructure Layer**: Provides implementations for external services and repositories
- **Shared Kernel**: Contains common interfaces, errors, and utilities

## Prerequisites
- [Bun](https://bun.sh) v1.1.28 or later
- Node.js compatible environment

## Installation
```bash
bun install
```

## Running the Application
```bash
bun run index.ts
```

## Development
- TypeScript is used for type-safe development
- Domain-Driven Design principles applied
- Multiple weather API integrations (OpenWeatherMap, Weather.gov)

## Architecture Highlights
- Separation of concerns
- Dependency inversion
- Immutable value objects
- Flexible API service integration

## License
See the LICENSE file for details.
