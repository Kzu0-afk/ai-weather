"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import {
  fetchWeather,
  fetchWeatherByCoordinates,
  searchCities,
  CitySuggestion,
  WeatherResponse,
} from "../lib/api";

export default function Home() {
  const [city, setCity] = useState("");
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Request user location on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator && !locationRequested) {
      setLocationRequested(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(true);
          setError(null);

          try {
            const result = await fetchWeatherByCoordinates(latitude, longitude);
            setData(result);
            setCity(result.city); // Update city input with detected location
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Unable to fetch weather for your location";
            setError(message);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          // User denied location or error occurred - silently fail, user can search manually
          console.log("Location access denied or error:", err.message);
          setLocationRequested(true); // Mark as requested to prevent retry
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        }
      );
    }
  }, [locationRequested]);

  // Handle city input change with debounced autocomplete
  useEffect(() => {
    const trimmed = city.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [city]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (suggestion: CitySuggestion) => {
    setCity(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchWeather(city);
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.panel}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>AI Weather · 静</p>
            <h1>Find calm, clear forecasts</h1>
            <p className={styles.subhead}>
              Search by city to see the essentials—temperature, humidity, wind,
              and a concise sky condition. Powered by the backend only; no
              direct provider calls from the browser.
            </p>
          </div>
          <div className={styles.badge}>Minimal JP</div>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="city">
            City
          </label>
          <div className={styles.inputRow}>
            <div className={styles.inputWrapper}>
              <input
                ref={inputRef}
                id="city"
                name="city"
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="e.g., Kyoto, Sapporo, Osaka"
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div ref={suggestionsRef} className={styles.suggestions}>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.name}-${suggestion.countryCode}-${index}`}
                      type="button"
                      className={styles.suggestionItem}
                      onClick={() => handleCitySelect(suggestion)}
                    >
                      <span className={styles.suggestionName}>
                        {suggestion.name}
                      </span>
                      <span className={styles.suggestionCountry}>
                        {suggestion.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Searching…" : "Get weather"}
            </button>
          </div>
          <p className={styles.hint}>
            Frontend calls NestJS only. Data normalized to the shared contract.
          </p>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {data && (
          <section className={styles.result}>
            <div className={styles.resultHeader}>
              <div>
                <p className={styles.city}>{data.city}</p>
                <p className={styles.meta}>
                  {data.country} · Updated {new Date(data.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className={styles.condition}>{data.condition}</div>
            </div>

            <div className={styles.grid}>
              <div className={styles.card}>
                <p className={styles.label}>Temperature</p>
                <p className={styles.value}>
                  {data.temperature}
                  <span className={styles.unit}>°C</span>
                </p>
              </div>
              <div className={styles.card}>
                <p className={styles.label}>Feels like</p>
                <p className={styles.value}>
                  {data.feelsLike}
                  <span className={styles.unit}>°C</span>
                </p>
              </div>
              <div className={styles.card}>
                <p className={styles.label}>Humidity</p>
                <p className={styles.value}>
                  {data.humidity}
                  <span className={styles.unit}>%</span>
                </p>
              </div>
              <div className={styles.card}>
                <p className={styles.label}>Wind</p>
                <p className={styles.value}>
                  {data.windSpeed}
                  <span className={styles.unit}>m/s</span>
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
