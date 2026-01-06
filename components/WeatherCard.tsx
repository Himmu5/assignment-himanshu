'use client';

import { CurrentWeather } from '@/types/weather';
import { convertTemperature, getWeatherIconUrl, formatTime, getWindDirection, TemperatureUnit } from '@/lib/utils';
import Card from './ui/Card';

interface WeatherCardProps {
  weather: CurrentWeather;
  unit: TemperatureUnit;
}

export default function WeatherCard({ weather, unit }: WeatherCardProps) {
  const temp = convertTemperature(weather.main.temp, unit);
  const feelsLike = convertTemperature(weather.main.feels_like, unit);
  const tempMin = convertTemperature(weather.main.temp_min, unit);
  const tempMax = convertTemperature(weather.main.temp_max, unit);
  const condition = weather.weather[0]?.main || 'Unknown';
  const description = weather.weather[0]?.description || '';
  const icon = weather.weather[0]?.icon || '01d';

  return (
    <Card hover>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {weather.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {weather.sys.country}
          </p>
        </div>
        <img
          src={getWeatherIconUrl(icon)}
          alt={condition}
          className="w-20 h-20"
        />
      </div>

      <div className="mb-4">
        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
          {temp}°{unit}
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 capitalize">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Feels Like</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {feelsLike}°{unit}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {weather.main.humidity}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {weather.wind.speed} m/s {getWindDirection(weather.wind.deg)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pressure</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {weather.main.pressure} hPa
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Visibility</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A'} km
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Cloudiness</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {weather.clouds.all}%
          </p>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p>High: {tempMax}°{unit}</p>
          <p>Low: {tempMin}°{unit}</p>
        </div>
        <div className="text-right">
          <p>Sunrise: {formatTime(weather.sys.sunrise)}</p>
          <p>Sunset: {formatTime(weather.sys.sunset)}</p>
        </div>
      </div>
    </Card>
  );
}

