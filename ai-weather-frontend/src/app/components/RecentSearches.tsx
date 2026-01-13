"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRecentSearches, clearRecentSearches, SavedCity } from "../../lib/storage";
import styles from "./RecentSearches.module.css";

export default function RecentSearches() {
  const router = useRouter();
  const [recent, setRecent] = useState<SavedCity[]>([]);

  useEffect(() => {
    setRecent(getRecentSearches());
    
    // Listen for storage changes (from other tabs)
    const handleStorageChange = () => {
      setRecent(getRecentSearches());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleCityClick = (city: SavedCity) => {
    const citySlug = encodeURIComponent(city.name);
    router.push(`/city/${citySlug}`);
  };

  const handleClear = () => {
    if (confirm("Clear all recent searches?")) {
      clearRecentSearches();
      setRecent([]);
    }
  };

  if (recent.length === 0) {
    return null;
  }

  return (
    <div className={styles.recentContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recent Searches</h3>
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear recent searches"
        >
          Clear
        </button>
      </div>
      <div className={styles.list} role="list">
        {recent.map((city, index) => (
          <button
            key={`${city.name}-${city.countryCode}-${index}`}
            type="button"
            className={styles.item}
            onClick={() => handleCityClick(city)}
            role="listitem"
            aria-label={`View weather for ${city.name}, ${city.country}`}
          >
            <span className={styles.cityName}>{city.name}</span>
            <span className={styles.country}>{city.country}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

