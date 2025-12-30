import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { GetWeatherByCoordsDto } from './dto/get-weather-by-coords.dto';
import { SearchCitiesDto } from './dto/search-cities.dto';
import {
  CitySuggestion,
  NormalizedWeather,
} from './interfaces/weather.types';

/**
 * Weather Controller
 * 
 * API Contract (Phase 1 & 2):
 * GET /weather?city=<cityName> - Get weather by city name
 * GET /weather/coordinates?latitude=<lat>&longitude=<lon> - Get weather by coordinates
 * GET /weather/search?query=<query> - Search for city suggestions (autocomplete)
 * 
 * Returns NormalizedWeather:
 * - city: string
 * - country: string
 * - temperature: number
 * - feelsLike: number
 * - condition: string
 * - humidity: number
 * - windSpeed: number
 * - updatedAt: string (ISO 8601)
 */
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query() query: GetWeatherDto): Promise<NormalizedWeather> {
    return this.weatherService.getWeather(query.city);
  }

  @Get('coordinates')
  async getWeatherByCoordinates(
    @Query() query: GetWeatherByCoordsDto,
  ): Promise<NormalizedWeather> {
    return this.weatherService.getWeatherByCoordinates(
      query.latitude,
      query.longitude,
    );
  }

  @Get('search')
  async searchCities(@Query() query: SearchCitiesDto): Promise<CitySuggestion[]> {
    return this.weatherService.searchCities(query.query);
  }

  @Get('cache/stats')
  getCacheStats() {
    return this.weatherService.getCacheStats();
  }
}
