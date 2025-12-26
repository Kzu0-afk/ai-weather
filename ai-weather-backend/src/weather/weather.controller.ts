import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './dto/get-weather.dto';
import { NormalizedWeather } from './interfaces/weather.types';

/**
 * Weather Controller
 * 
 * API Contract (Phase 1):
 * GET /weather?city=<cityName>
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
}
