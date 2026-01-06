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

  // Get weather condition for dynamic background - more subtle and cohesive
  const getWeatherGradient = () => {
    if (!currentWeather) {
      return 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
    }
    const condition = currentWeather.weather[0]?.main?.toLowerCase() || '';
    if (condition.includes('clear') || condition.includes('sun')) {
      return 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/30';
    }
    if (condition.includes('cloud')) {
      return 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/30';
    }
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/30';
    }
    return 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950';
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${getWeatherGradient()}`}>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-500 bg-clip-text text-transparent">
                Weather Forecast
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                Get accurate weather information for any city
              </p>
            </div>
            <div className="flex items-center gap-3">
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
        <div className="space-y-6 md:space-y-8">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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

