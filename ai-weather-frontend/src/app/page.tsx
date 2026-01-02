"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import {
  fetchWeatherByCoordinates,
  searchCities,
  CitySuggestion,
} from "../lib/api";

export default function Home() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
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
          setError(null);

          try {
            const result = await fetchWeatherByCoordinates(latitude, longitude);
            // Navigate to city page with detected location
            const citySlug = encodeURIComponent(result.city);
            router.push(`/city/${citySlug}`);
          } catch (err) {
            const message =
              err instanceof Error ? err.message : "Unable to fetch weather for your location";
            setError(message);
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
    setShowSuggestions(false);
    setSuggestions([]);
    // Navigate directly to city page
    const citySlug = encodeURIComponent(suggestion.name);
    router.push(`/city/${citySlug}`);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCity = city.trim();
    
    if (!trimmedCity) {
      setError("Please enter a city name.");
      return;
    }

    setError(null);

    // Navigate to city page
    const citySlug = encodeURIComponent(trimmedCity);
    router.push(`/city/${citySlug}`);
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

        <form className={styles.form} onSubmit={handleSubmit} aria-label="Weather search form">
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
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                placeholder="e.g., Kyoto, Sapporo, Osaka"
                autoComplete="off"
                aria-label="City name"
                aria-autocomplete="list"
                aria-expanded={showSuggestions && suggestions.length > 0}
                aria-controls={showSuggestions && suggestions.length > 0 ? "city-suggestions" : undefined}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  id="city-suggestions"
                  className={styles.suggestions}
                  role="listbox"
                  aria-label="City suggestions"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.name}-${suggestion.countryCode}-${index}`}
                      type="button"
                      className={styles.suggestionItem}
                      onClick={() => handleCitySelect(suggestion)}
                      role="option"
                      aria-label={`${suggestion.name}, ${suggestion.country}`}
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
            <button
              type="submit"
              aria-label="Get weather information"
            >
              Get weather
            </button>
          </div>
          <p className={styles.hint}>
            Frontend calls NestJS only. Data normalized to the shared contract.
          </p>
        </form>

        {error && (
          <div className={styles.error} role="alert" aria-live="assertive">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
