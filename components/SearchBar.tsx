'use client';

import { useState, FormEvent, KeyboardEvent, useEffect, useRef } from 'react';
import Button from './ui/Button';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  recentSearches?: string[];
  onRecentSearchClick?: (city: string) => void;
  onRecentSearchRemove?: (city: string) => void;
}

export default function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = 'Enter city name...',
  recentSearches = [],
  onRecentSearchClick,
  onRecentSearchRemove,
}: SearchBarProps) {
  const [city, setCity] = useState<string>('');
  const [showRecent, setShowRecent] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setShowRecent(false);
    }
  };

  const handleClear = () => {
    setCity('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
      setShowRecent(false);
    }
  };

  const handleRecentClick = (searchCity: string) => {
    onRecentSearchClick?.(searchCity);
    setShowRecent(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    if (recentSearches.length > 0) {
      setShowRecent(true);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input on mount for better UX
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              placeholder={placeholder}
              className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-md hover:shadow-lg"
              disabled={isLoading}
              aria-label="Search for a city"
              aria-expanded={showRecent}
              aria-haspopup="listbox"
            />
            {city && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={!city.trim()}
          >
            Search
          </Button>
        </div>
      </form>

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-fade-in">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Searches</span>
            {onRecentSearchRemove && (
              <button
                onClick={() => {
                  recentSearches.forEach((s) => onRecentSearchRemove?.(s));
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear all
              </button>
            )}
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto">
            {recentSearches.map((searchCity, index) => (
              <li
                key={`${searchCity}-${index}`}
                role="option"
                className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between group"
                onClick={() => handleRecentClick(searchCity)}
              >
                <span className="text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {searchCity}
                </span>
                {onRecentSearchRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRecentSearchRemove(searchCity);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                    aria-label={`Remove ${searchCity} from recent searches`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd> to search,{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd> to clear
      </p>
    </div>
  );
}

