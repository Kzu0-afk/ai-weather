/**
 * Weather API Contract (Phase 1)
 * 
 * Matches backend NormalizedWeather interface:
 * - city: string
 * - country: string
 * - temperature: number
 * - feelsLike: number
 * - condition: string
 * - humidity: number
 * - windSpeed: number
 * - updatedAt: string (ISO 8601)
 */
export type WeatherResponse = {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  updatedAt: string;
};

export type CitySuggestion = {
  name: string;
  country: string;
  countryCode: string;
};

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

/**
 * Fetches weather data from the backend API by city name
 * @param city - City name to search for
 * @returns Promise<WeatherResponse> - Normalized weather data
 * @throws Error if city is empty or API request fails
 */
export async function fetchWeather(city: string): Promise<WeatherResponse> {
  const trimmed = city.trim();
  if (!trimmed) {
    throw new Error('Please enter a city name.');
  }

  const url = `${DEFAULT_API_BASE}/weather?city=${encodeURIComponent(trimmed)}`;
  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    let errorMessage = 'Unable to fetch weather data';
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      const text = await res.text();
      if (text) {
        errorMessage = text;
      }
    }

    // Format user-friendly error messages
    if (res.status === 404) {
      throw new Error('404 Error | Location not found');
    } else if (res.status >= 500) {
      throw new Error('Server error | Please try again later');
    } else {
      throw new Error(errorMessage);
    }
  }

  return res.json();
}

/**
 * Fetches weather data from the backend API by coordinates
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Promise<WeatherResponse> - Normalized weather data
 * @throws Error if coordinates are invalid or API request fails
 */
export async function fetchWeatherByCoordinates(
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> {
  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    throw new Error('Invalid coordinates provided.');
  }

  const url = `${DEFAULT_API_BASE}/weather/coordinates?latitude=${latitude}&longitude=${longitude}`;
  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    let errorMessage = 'Unable to fetch weather data';
    try {
      const errorData = await res.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      const text = await res.text();
      if (text) {
        errorMessage = text;
      }
    }

    // Format user-friendly error messages
    if (res.status === 404) {
      throw new Error('404 Error | Location not found');
    } else if (res.status >= 500) {
      throw new Error('Server error | Please try again later');
    } else {
      throw new Error(errorMessage);
    }
  }

  return res.json();
}

/**
 * Searches for city suggestions (autocomplete)
 * @param query - Search query string
 * @returns Promise<CitySuggestion[]> - Array of city suggestions
 */
export async function searchCities(query: string): Promise<CitySuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 1) {
    return [];
  }

  const url = `${DEFAULT_API_BASE}/weather/search?query=${encodeURIComponent(trimmed)}`;
  
  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}
