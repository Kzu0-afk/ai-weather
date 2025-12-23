"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";
import { fetchWeather, WeatherResponse } from "../lib/api";

export default function Home() {
  const [city, setCity] = useState("Tokyo");
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
            <input
              id="city"
              name="city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="e.g., Kyoto, Sapporo, Osaka"
              autoComplete="off"
            />
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
