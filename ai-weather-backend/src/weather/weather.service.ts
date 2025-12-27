import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  CityLookupResult,
  CitySuggestion,
  NormalizedWeather,
} from './interfaces/weather.types';

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

  async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<NormalizedWeather> {
    // Cache key based on rounded coordinates (to 2 decimal places = ~1km precision)
    const cacheKey = `coords:${latitude.toFixed(2)},${longitude.toFixed(2)}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Reverse geocode to get city name and timezone
    const cityData = await this.reverseGeocode(latitude, longitude);
    const weather = await this.fetchWeatherByCoords(
      latitude,
      longitude,
      cityData.timezone,
    );

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

    this.cache.set(cacheKey, {
      payload: normalized,
      expiresAt: Date.now() + this.cacheTtlMs,
    });

    return normalized;
  }

  async searchCities(query: string): Promise<CitySuggestion[]> {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 1) {
      return [];
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed,
    )}&count=5&language=en&format=json`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 5000,
        }),
      );

      const results = response.data?.results || [];

      return results.map((result: any) => ({
        name: result.name,
        country: result.country || '',
        countryCode: result.country_code || '',
      }));
    } catch (error) {
      // Return empty array on error instead of throwing
      return [];
    }
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
    return this.fetchWeatherByCoords(city.latitude, city.longitude, city.timezone);
  }

  private async fetchWeatherByCoords(
    latitude: number,
    longitude: number,
    timezone: string,
  ) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${encodeURIComponent(
      timezone,
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

  private async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<CityLookupResult> {
    // Use Nominatim (OpenStreetMap) for reverse geocoding (free, no API key)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 8000,
          headers: {
            'User-Agent': 'AI-Weather-App/1.0',
          },
        }),
      );

      const address = response.data?.address;
      if (address) {
        const cityName =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county ||
          `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

        // Estimate timezone from longitude (rough approximation)
        const timezoneOffset = Math.round(longitude / 15);
        const timezone = `Etc/GMT${timezoneOffset >= 0 ? '-' : '+'}${Math.abs(timezoneOffset)}`;

        return {
          name: cityName,
          countryCode: address.country_code?.toUpperCase() || 'XX',
          latitude,
          longitude,
          timezone,
        };
      }

      throw new Error('No address found');
    } catch (error) {
      // Fallback: use coordinates and estimate timezone
      const timezoneOffset = Math.round(longitude / 15);
      const timezone = `Etc/GMT${timezoneOffset >= 0 ? '-' : '+'}${Math.abs(timezoneOffset)}`;
      return {
        name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        countryCode: 'XX',
        latitude,
        longitude,
        timezone,
      };
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
