import { useState, useEffect, useCallback } from 'react';
import { WeatherTableRow, WeatherError } from '@/types/weather';
import { fetchMultipleCitiesWeather } from '@/lib/weatherApi';
import { POPULAR_CITIES } from '@/lib/constants';

// Show only top 5 popular cities
const TOP_5_CITIES = POPULAR_CITIES.slice(0, 5);

interface UsePopularCitiesOptions {
  apiKey: string;
}

interface UsePopularCitiesReturn {
  tableData: WeatherTableRow[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePopularCities({ apiKey }: UsePopularCitiesOptions): UsePopularCitiesReturn {
  const [tableData, setTableData] = useState<WeatherTableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadTableData = useCallback(async () => {
    if (!apiKey) return;

    setLoading(true);
    setError(null);

    try {
      const results = await fetchMultipleCitiesWeather(TOP_5_CITIES, apiKey);
      const rows: WeatherTableRow[] = results
        .filter((result) => result.data !== null)
        .map((result) => ({
          city: result.city,
          temperature: result.data!.main.temp,
          condition: result.data!.weather[0]?.main || 'Unknown',
          humidity: result.data!.main.humidity,
          windSpeed: result.data!.wind.speed,
        }));

      setTableData(rows);
    } catch (err) {
      const weatherError = err as WeatherError;
      setError(weatherError.message || 'Failed to load popular cities data');
      console.error('Failed to load table data:', err);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    loadTableData();
  }, [loadTableData]);

  return {
    tableData,
    loading,
    error,
    refresh: loadTableData,
  };
}

