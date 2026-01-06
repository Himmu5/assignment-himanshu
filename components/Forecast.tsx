'use client';

import { ForecastItem, TemperatureUnit } from '@/types/weather';
import { convertTemperature, getWeatherIconUrl, formatDate } from '@/lib/utils';

interface ForecastProps {
  forecast: ForecastItem[];
  unit: TemperatureUnit;
}

export default function Forecast({ forecast, unit }: ForecastProps) {
  // Group forecast by day and select a representative forecast for each day (prefer midday)
  const dailyForecast: ForecastItem[] = [];
  const dayGroups = new Map<string, ForecastItem[]>();

  // Group forecasts by date
  forecast.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dayGroups.has(date)) {
      dayGroups.set(date, []);
    }
    dayGroups.get(date)!.push(item);
  });

  // Select one representative forecast per day (prefer midday, around 12:00)
  const sortedDates = Array.from(dayGroups.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  sortedDates.slice(0, 5).forEach((date) => {
    const dayItems = dayGroups.get(date)!;
    // Find the forecast closest to midday (12:00)
    const representative = dayItems.reduce((best, current) => {
      const bestHour = new Date(best.dt * 1000).getHours();
      const currentHour = new Date(current.dt * 1000).getHours();
      const bestDiff = Math.abs(bestHour - 12);
      const currentDiff = Math.abs(currentHour - 12);
      return currentDiff < bestDiff ? current : best;
    });
    dailyForecast.push(representative);
  });

  if (dailyForecast.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        5-Day Forecast
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {dailyForecast.map((item, index) => {
          const temp = convertTemperature(item.main.temp, unit);
          const tempMax = convertTemperature(item.main.temp_max, unit);
          const tempMin = convertTemperature(item.main.temp_min, unit);
          const condition = item.weather[0]?.main || 'Unknown';
          const icon = item.weather[0]?.icon || '01d';

          return (
            <div
              key={`${item.dt}-${index}`}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {formatDate(item.dt)}
              </p>
              <img
                src={getWeatherIconUrl(icon)}
                alt={condition}
                className="w-12 h-12 mx-auto mb-2"
              />
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {temp}°{unit}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 capitalize">
                {item.weather[0]?.description}
              </p>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>H: {tempMax}°</span>
                <span>L: {tempMin}°</span>
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <p>Humidity: {item.main.humidity}%</p>
                <p>Wind: {item.wind.speed} m/s</p>
                {item.pop !== undefined && (
                  <p className="flex items-center gap-1 justify-center mt-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                    </svg>
                    Rain: {Math.round((item.pop || 0) * 100)}%
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

