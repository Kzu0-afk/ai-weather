"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CitySearch.module.css";
import { CitySuggestion, searchCities } from "../../lib/api";

type Props = {
  initialCity?: string;
};

export default function CitySearch({ initialCity = "" }: Props) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = city.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const results = await searchCities(trimmed);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [city]);

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

  const validateCity = (cityName: string): string | null => {
    const trimmed = cityName.trim();

    if (!trimmed) return "Please enter a city name.";
    if (trimmed.length > 100) return "City name is too long (maximum 100 characters).";
    if (/[<>{}[\]\\]/.test(trimmed)) return "City name contains invalid characters.";

    return null;
  };

  const goToCity = (name: string) => {
    const trimmed = name.trim();
    const citySlug = encodeURIComponent(trimmed);
    router.push(`/city/${citySlug}`);
  };

  const handleCitySelect = (suggestion: CitySuggestion) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setError(null);
    setCity(suggestion.name);
    goToCity(suggestion.name);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateCity(city);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    goToCity(city);
  };

  return (
    <div className={styles.wrapper} aria-label="Search another city">
      <form className={styles.form} onSubmit={handleSubmit} aria-label="City search form">
        <label className={styles.label} htmlFor="citySearch">
          Search
        </label>
        <div className={styles.inputRow}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              id="citySearch"
              name="citySearch"
              value={city}
              maxLength={100}
              onChange={(event) => {
                setCity(event.target.value);
                setShowSuggestions(true);
                if (error) setError(null);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowSuggestions(false);
              }}
              placeholder="Search another city (e.g., Tokyo)"
              autoComplete="off"
              aria-label="City name"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls={showSuggestions && suggestions.length > 0 ? "city-search-suggestions" : undefined}
              aria-invalid={error ? "true" : "false"}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                id="city-search-suggestions"
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
                    <span className={styles.suggestionName}>{suggestion.name}</span>
                    <span className={styles.suggestionCountry}>{suggestion.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className={styles.button} aria-label="Search city">
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className={styles.error} role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
}


