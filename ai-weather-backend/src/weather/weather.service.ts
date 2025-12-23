import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CityLookupResult, NormalizedWeather } from './interfaces/weather.types';

@Injectable()
export class WeatherService {
  private readonly cache = new Map<
    string,
    { payload: NormalizedWeather; expiresAt: number }
  >();
  private readonly cacheTtlMs = 15 * 60 * 1000; // 15 minutes

  constructor(private readonly httpService: HttpService) {}

  async getWeather(city: string): Promise<NormalizedWeather> {
    const normalizedCity = city.trim();
    if (!normalizedCity) {
      throw new BadRequestException('city is required');
    }

    const cached = this.getFromCache(normalizedCity);
    if (cached) {
      return cached;
    }

    const cityData = await this.lookupCity(normalizedCity);
    const weather = await this.fetchWeather(cityData);

    const normalized: NormalizedWeather = {
      city: cityData.name,
      country: cityData.countryCode,
      temperature: Math.round(weather.temperature_2m),
      feelsLike: Math.round(weather.apparent_temperature),
      condition: this.mapWeatherCode(weather.weather_code),
      humidity: weather.relative_humidity_2m,
      windSpeed: weather.wind_speed_10m,
      updatedAt: weather.time,
    };

    this.cache.set(normalizedCity.toLowerCase(), {
      payload: normalized,
      expiresAt: Date.now() + this.cacheTtlMs,
    });

    return normalized;
  }

  private getFromCache(city: string): NormalizedWeather | null {
    const entry = this.cache.get(city.toLowerCase());
    if (!entry) {
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(city.toLowerCase());
      return null;
    }

    return entry.payload;
  }

  private async lookupCity(city: string): Promise<CityLookupResult> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city,
    )}&count=1&language=en&format=json`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 8000,
        }),
      );

      const result = response.data?.results?.[0];

      if (!result) {
        throw new NotFoundException(`Could not find weather for "${city}"`);
      }

      return {
        name: result.name,
        countryCode: result.country_code,
        latitude: result.latitude,
        longitude: result.longitude,
        timezone: result.timezone,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Unable to lookup city');
    }
  }

  private async fetchWeather(city: CityLookupResult) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${
      city.latitude
    }&longitude=${city.longitude}&timezone=${encodeURIComponent(
      city.timezone,
    )}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 8000,
        }),
      );

      if (!response.data?.current) {
        throw new InternalServerErrorException('Malformed provider response');
      }

      return response.data.current as {
        time: string;
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        weather_code: number;
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to fetch weather data');
    }
  }

  private mapWeatherCode(code: number): string {
    const WEATHER_CODE_MAP: Record<number, string> = {
      0: 'Clear',
      1: 'Mostly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Freezing fog',
      51: 'Light drizzle',
      53: 'Drizzle',
      55: 'Heavy drizzle',
      56: 'Freezing drizzle',
      57: 'Freezing drizzle',
      61: 'Light rain',
      63: 'Rain',
      65: 'Heavy rain',
      66: 'Freezing rain',
      67: 'Freezing rain',
      71: 'Light snow',
      73: 'Snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Rain showers',
      81: 'Rain showers',
      82: 'Heavy rain showers',
      85: 'Snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm',
      99: 'Severe thunderstorm',
    };

    return WEATHER_CODE_MAP[code] ?? 'Unknown';
  }
}
