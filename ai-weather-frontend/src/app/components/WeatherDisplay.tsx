"use client";

import { useEffect, useState } from "react";
import { WeatherResponse } from "../../lib/api";
import { addFavorite, removeFavorite, isFavorite } from "../../lib/storage";
import styles from "./WeatherDisplay.module.css";

interface WeatherDisplayProps {
  data: WeatherResponse;
  showFavoriteButton?: boolean;
}

export default function WeatherDisplay({ data, showFavoriteButton = true }: WeatherDisplayProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (showFavoriteButton) {
      setFavorited(isFavorite(data.city, data.country));
    }
  }, [data.city, data.country, showFavoriteButton]);

  const handleFavoriteToggle = () => {
    if (favorited) {
      removeFavorite(data.city, data.country);
      setFavorited(false);
    } else {
      addFavorite({
        name: data.city,
        country: data.country,
        countryCode: data.country,
        savedAt: new Date().toISOString(),
      });
      setFavorited(true);
    }
  };

  return (
    <section className={styles.result} aria-label="Weather information">
      <div className={styles.resultHeader}>
        <div>
          <div className={styles.cityRow}>
            <h2 className={styles.city}>{data.city}</h2>
            {showFavoriteButton && (
              <button
                type="button"
                onClick={handleFavoriteToggle}
                className={styles.favoriteButton}
                aria-label={favorited ? `Remove ${data.city} from favorites` : `Add ${data.city} to favorites`}
                title={favorited ? "Remove from favorites" : "Add to favorites"}
              >
                {favorited ? "★" : "☆"}
              </button>
            )}
          </div>
          <p className={styles.meta}>
            <span aria-label={`Country: ${data.country}`}>{data.country}</span>
            {" · "}
            <span
              aria-label={`Last updated: ${new Date(data.updatedAt).toLocaleString()}`}
            >
              Updated {new Date(data.updatedAt).toLocaleString()}
            </span>
          </p>
        </div>
        <div
          className={styles.condition}
          aria-label={`Weather condition: ${data.condition}`}
        >
          {data.condition}
        </div>
      </div>

      <div className={styles.grid} role="grid" aria-label="Weather metrics">
        <div className={styles.card} role="gridcell">
          <p className={styles.label}>Temperature</p>
          <p className={styles.value}>
            <span
              aria-label={`Temperature: ${data.temperature} degrees Celsius`}
            >
              {data.temperature}
            </span>
            <span className={styles.unit} aria-hidden="true">
              °C
            </span>
          </p>
        </div>
        <div className={styles.card} role="gridcell">
          <p className={styles.label}>Feels like</p>
          <p className={styles.value}>
            <span
              aria-label={`Feels like: ${data.feelsLike} degrees Celsius`}
            >
              {data.feelsLike}
            </span>
            <span className={styles.unit} aria-hidden="true">
              °C
            </span>
          </p>
        </div>
        <div className={styles.card} role="gridcell">
          <p className={styles.label}>Humidity</p>
          <p className={styles.value}>
            <span aria-label={`Humidity: ${data.humidity} percent`}>
              {data.humidity}
            </span>
            <span className={styles.unit} aria-hidden="true">%</span>
          </p>
        </div>
        <div className={styles.card} role="gridcell">
          <p className={styles.label}>Wind</p>
          <p className={styles.value}>
            <span
              aria-label={`Wind speed: ${data.windSpeed} meters per second`}
            >
              {data.windSpeed}
            </span>
            <span className={styles.unit} aria-hidden="true">m/s</span>
          </p>
        </div>
      </div>
    </section>
  );
}

