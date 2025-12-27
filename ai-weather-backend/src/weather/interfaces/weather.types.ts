export interface NormalizedWeather {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  updatedAt: string;
}

export interface CityLookupResult {
  name: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CitySuggestion {
  name: string;
  country: string;
  countryCode: string;
}

