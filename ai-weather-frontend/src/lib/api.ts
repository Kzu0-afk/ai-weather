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

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

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
    const message = await res.text();
    throw new Error(message || 'Unable to fetch weather data');
  }

  return res.json();
}

