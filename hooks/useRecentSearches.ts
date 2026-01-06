import { useState, useEffect } from 'react';

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = 'weather_recent_searches';

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  const addSearch = (city: string) => {
    if (!city.trim()) return;

    setRecentSearches((prev) => {
      // Remove if already exists and add to beginning
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeSearch = (city: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}

