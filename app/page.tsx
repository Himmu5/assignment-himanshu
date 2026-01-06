'use client';

import { useState, useEffect } from 'react';
import { TemperatureUnit } from '@/types/weather';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { usePopularCities } from '@/hooks/usePopularCities';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import SearchBar from '@/components/SearchBar';
import WeatherCard from '@/components/WeatherCard';
import WeatherTable from '@/components/WeatherTable';
import Forecast from '@/components/Forecast';
import HourlyForecast from '@/components/HourlyForecast';
import DarkModeToggle from '@/components/DarkModeToggle';
import UnitToggle from '@/components/UnitToggle';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { WeatherCardSkeleton, TableSkeleton, ForecastSkeleton } from '@/components/SkeletonLoader';

export default function Home() {
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDark, toggleDarkMode] = useDarkMode();
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '';

  const {
    currentWeather,
    forecast,
    loading,
    error,
    fetchByCity,
    fetchByCoords,
    clearError,
  } = useWeather({
    apiKey,
    onError: () => {
      // Error handling is done in the hook
    },
  });

  const { tableData, loading: tableLoading, refresh: refreshTable } = usePopularCities({ apiKey });
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();

  // Auto-detect location on mount
  useEffect(() => {
    if (latitude && longitude && apiKey) {
      fetchByCoords(latitude, longitude);
      setLastUpdated(new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  // Update last updated when weather data changes
  useEffect(() => {
    if (currentWeather) {
      setLastUpdated(new Date());
    }
  }, [currentWeather]);

  const handleLocationWeather = async () => {
    if (latitude && longitude) {
      await fetchByCoords(latitude, longitude);
      setLastUpdated(new Date());
    }
  };

  const handleSearch = async (city: string) => {
    await fetchByCity(city);
    addSearch(city);
    setLastUpdated(new Date());
  };

  const handleCityClick = async (city: string) => {
    await fetchByCity(city);
    addSearch(city);
    setLastUpdated(new Date());
    // Scroll to top to show the weather card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecentSearchClick = async (city: string) => {
    await handleSearch(city);
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Weather Forecast
            </h1>
            <div className="flex items-center gap-4">
              <UnitToggle unit={unit} onToggle={toggleUnit} />
              <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            isLoading={loading}
            recentSearches={recentSearches}
            onRecentSearchClick={handleRecentSearchClick}
            onRecentSearchRemove={removeSearch}
          />

          {/* Location Button */}
          {!geoError && (latitude || longitude) && (
            <div className="mt-4 text-center">
              <Button
                variant="success"
                size="md"
                onClick={handleLocationWeather}
                isLoading={geoLoading}
                disabled={loading || geoLoading}
              >
                {geoLoading ? 'Detecting...' : 'Use My Location'}
              </Button>
            </div>
          )}
        </header>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={clearError}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  clearError();
                  if (latitude && longitude) {
                    handleLocationWeather();
                  }
                }}
              >
                Retry
              </Button>
            }
          />
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Current Weather Card */}
          {loading ? (
            <WeatherCardSkeleton />
          ) : currentWeather ? (
            <div>
              <WeatherCard weather={currentWeather} unit={unit} />
              {lastUpdated && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          ) : (
            <EmptyState
              icon={
                <svg
                  className="w-16 h-16 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              title="Search for Weather"
              description="Enter a city name above or click on a city from the popular cities table below to see weather information"
            />
          )}

          {/* Hourly Forecast */}
          {loading ? (
            <ForecastSkeleton />
          ) : forecast ? (
            <HourlyForecast forecast={forecast.list} unit={unit} />
          ) : null}

          {/* 5-Day Forecast */}
          {loading ? (
            <ForecastSkeleton />
          ) : forecast ? (
            <Forecast forecast={forecast.list} unit={unit} />
          ) : null}

          {/* Weather Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Popular Cities Weather
              </h2>
              {!tableLoading && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={refreshTable}
                  aria-label="Refresh popular cities data"
                >
                  <svg
                    className="w-4 h-4 inline-block mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </Button>
              )}
            </div>
            {tableLoading ? (
              <TableSkeleton />
            ) : tableData.length > 0 ? (
              <WeatherTable data={tableData} unit={unit} onCityClick={handleCityClick} />
            ) : (
              <EmptyState
                title="No Weather Data Available"
                description="Unable to load popular cities weather data. Please try refreshing."
                action={
                  <Button variant="primary" onClick={refreshTable}>
                    Refresh Data
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

