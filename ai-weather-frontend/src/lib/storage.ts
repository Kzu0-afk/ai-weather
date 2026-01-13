/**
 * localStorage utilities for favorites and recent searches
 */

export interface SavedCity {
  name: string;
  country: string;
  countryCode: string;
  savedAt: string;
}

const FAVORITES_KEY = 'ai-weather-favorites';
const RECENT_SEARCHES_KEY = 'ai-weather-recent-searches';
const MAX_RECENT_SEARCHES = 10;
const MAX_FAVORITES = 20;

/**
 * Get all favorite cities from localStorage
 */
export function getFavorites(): SavedCity[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SavedCity[];
  } catch {
    return [];
  }
}

/**
 * Add a city to favorites
 */
export function addFavorite(city: SavedCity): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    
    // Check if already favorited
    if (favorites.some(f => f.name === city.name && f.countryCode === city.countryCode)) {
      return;
    }
    
    // Limit favorites
    if (favorites.length >= MAX_FAVORITES) {
      favorites.shift(); // Remove oldest
    }
    
    favorites.push({
      ...city,
      savedAt: new Date().toISOString(),
    });
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Remove a city from favorites
 */
export function removeFavorite(cityName: string, countryCode: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(
      f => !(f.name === cityName && f.countryCode === countryCode)
    );
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Check if a city is favorited
 */
export function isFavorite(cityName: string, countryCode: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const favorites = getFavorites();
  return favorites.some(f => f.name === cityName && f.countryCode === countryCode);
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): SavedCity[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SavedCity[];
  } catch {
    return [];
  }
}

/**
 * Add a city to recent searches
 */
export function addRecentSearch(city: SavedCity): void {
  if (typeof window === 'undefined') return;
  
  try {
    const recent = getRecentSearches();
    
    // Remove if already exists (to move to top)
    const filtered = recent.filter(
      r => !(r.name === city.name && r.countryCode === city.countryCode)
    );
    
    // Add to beginning
    filtered.unshift({
      ...city,
      savedAt: new Date().toISOString(),
    });
    
    // Limit to MAX_RECENT_SEARCHES
    const limited = filtered.slice(0, MAX_RECENT_SEARCHES);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limited));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Clear recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

