import { CurrentWeather, ForecastResponse, WeatherError } from '@/types/weather';
import { API_BASE_URL } from './constants';

export async function fetchCurrentWeather(
  city: string,
  apiKey: string
): Promise<CurrentWeather> {
  const response = await fetch(
    `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: WeatherError = {
      message: errorData.message || 'Failed to fetch weather data',
      code: response.status,
    };
    throw error;
  }

  return response.json();
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number,
  apiKey: string
): Promise<CurrentWeather> {
  const response = await fetch(
    `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: WeatherError = {
      message: errorData.message || 'Failed to fetch weather data',
      code: response.status,
    };
    throw error;
  }

  return response.json();
}

export async function fetchForecast(
  city: string,
  apiKey: string
): Promise<ForecastResponse> {
  const response = await fetch(
    `${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: WeatherError = {
      message: errorData.message || 'Failed to fetch forecast data',
      code: response.status,
    };
    throw error;
  }

  return response.json();
}

export async function fetchForecastByCoords(
  lat: number,
  lon: number,
  apiKey: string
): Promise<ForecastResponse> {
  const response = await fetch(
    `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: WeatherError = {
      message: errorData.message || 'Failed to fetch forecast data',
      code: response.status,
    };
    throw error;
  }

  return response.json();
}

export async function fetchMultipleCitiesWeather(
  cities: string[],
  apiKey: string
): Promise<Array<{ city: string; data: CurrentWeather | null; error?: WeatherError }>> {
  const promises = cities.map(async (city) => {
    try {
      const data = await fetchCurrentWeather(city, apiKey);
      return { city, data, error: undefined };
    } catch (error) {
      return {
        city,
        data: null,
        error: error as WeatherError,
      };
    }
  });

  return Promise.all(promises);
}

