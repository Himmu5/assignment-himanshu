import { useState, useCallback } from 'react';
import { CurrentWeather, ForecastResponse, WeatherError, TemperatureUnit } from '@/types/weather';
import {
  fetchCurrentWeather,
  fetchWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
} from '@/lib/weatherApi';

interface UseWeatherOptions {
  apiKey: string;
  onError?: (error: WeatherError) => void;
}

interface UseWeatherReturn {
  currentWeather: CurrentWeather | null;
  forecast: ForecastResponse | null;
  loading: boolean;
  error: string | null;
  fetchByCity: (city: string) => Promise<void>;
  fetchByCoords: (lat: number, lon: number) => Promise<void>;
  clearError: () => void;
  clearData: () => void;
}

export function useWeather({ apiKey, onError }: UseWeatherOptions): UseWeatherReturn {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setCurrentWeather(null);
    setForecast(null);
    setError(null);
  }, []);

  const fetchByCity = useCallback(
    async (city: string) => {
      if (!apiKey) {
        const errorMessage = 'API key is not configured. Please set NEXT_PUBLIC_WEATHER_API_KEY in .env.local';
        setError(errorMessage);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchCurrentWeather(city, apiKey),
          fetchForecast(city, apiKey),
        ]);

        setCurrentWeather(weatherData);
        setForecast(forecastData);
      } catch (err) {
        const weatherError = err as WeatherError;
        const errorMessage = weatherError.message || 'Failed to fetch weather data';
        setError(errorMessage);
        setCurrentWeather(null);
        setForecast(null);
        
        if (onError) {
          onError(weatherError);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiKey, onError]
  );

  const fetchByCoords = useCallback(
    async (lat: number, lon: number) => {
      if (!apiKey) {
        const errorMessage = 'API key is not configured. Please set NEXT_PUBLIC_WEATHER_API_KEY in .env.local';
        setError(errorMessage);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchWeatherByCoords(lat, lon, apiKey),
          fetchForecastByCoords(lat, lon, apiKey),
        ]);

        setCurrentWeather(weatherData);
        setForecast(forecastData);
      } catch (err) {
        const weatherError = err as WeatherError;
        const errorMessage = weatherError.message || 'Failed to fetch weather data';
        setError(errorMessage);
        
        if (onError) {
          onError(weatherError);
        }
      } finally {
        setLoading(false);
      }
    },
    [apiKey, onError]
  );

  return {
    currentWeather,
    forecast,
    loading,
    error,
    fetchByCity,
    fetchByCoords,
    clearError,
    clearData,
  };
}

