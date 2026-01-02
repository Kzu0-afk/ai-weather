import { WeatherResponse } from "../../lib/api";
import styles from "./WeatherDisplay.module.css";

interface WeatherDisplayProps {
  data: WeatherResponse;
}

export default function WeatherDisplay({ data }: WeatherDisplayProps) {
  return (
    <section className={styles.result} aria-label="Weather information">
      <div className={styles.resultHeader}>
        <div>
          <h2 className={styles.city}>{data.city}</h2>
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

