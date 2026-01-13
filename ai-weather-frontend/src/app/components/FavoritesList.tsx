"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getFavorites, removeFavorite, SavedCity } from "../../lib/storage";
import styles from "./FavoritesList.module.css";

export default function FavoritesList() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<SavedCity[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    
    // Listen for storage changes (from other tabs)
    const handleStorageChange = () => {
      setFavorites(getFavorites());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleCityClick = (city: SavedCity) => {
    const citySlug = encodeURIComponent(city.name);
    router.push(`/city/${citySlug}`);
  };

  const handleRemove = (e: React.MouseEvent, city: SavedCity) => {
    e.stopPropagation();
    removeFavorite(city.name, city.countryCode);
    setFavorites(getFavorites());
  };

  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className={styles.favoritesContainer}>
      <h3 className={styles.title}>Favorites</h3>
      <div className={styles.list} role="list">
        {favorites.map((city, index) => (
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
            <button
              type="button"
              className={styles.removeButton}
              onClick={(e) => handleRemove(e, city)}
              aria-label={`Remove ${city.name} from favorites`}
              title="Remove from favorites"
            >
              ×
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}

