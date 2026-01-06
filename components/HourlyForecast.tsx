'use client';

import { ForecastItem, TemperatureUnit } from '@/types/weather';
import { convertTemperature, getWeatherIconUrl, formatTime } from '@/lib/utils';

interface HourlyForecastProps {
  forecast: ForecastItem[];
  unit: TemperatureUnit;
}

export default function HourlyForecast({ forecast, unit }: HourlyForecastProps) {
  // Get next 24 hours (8 items, 3-hour intervals)
  const hourlyData = forecast.slice(0, 8);

  if (hourlyData.length === 0) {
    return null;
  }

  // Group by time periods
  const getTimePeriod = (hour: number): string => {
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Overnight';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hourly Forecast</h3>
      
      {/* Time Period Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['Morning', 'Afternoon', 'Evening', 'Overnight'].map((period) => {
          const periodItems = hourlyData.filter((item) => {
            const hour = new Date(item.dt * 1000).getHours();
            return getTimePeriod(hour) === period;
          });

          if (periodItems.length === 0) return null;

          const avgTemp = Math.round(
            periodItems.reduce((sum, item) => sum + item.main.temp, 0) / periodItems.length
          );
          const representative = periodItems[Math.floor(periodItems.length / 2)];
          const condition = representative.weather[0]?.main || 'Unknown';
          const icon = representative.weather[0]?.icon || '01d';
          const pop = Math.round(
            periodItems.reduce((sum, item) => sum + (item.pop || 0), 0) / periodItems.length * 100
          );

          return (
            <div
              key={period}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{period}</p>
              <img
                src={getWeatherIconUrl(icon)}
                alt={condition}
                className="w-10 h-10 mx-auto mb-2"
              />
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {convertTemperature(avgTemp, unit)}°{unit}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize mb-1">
                {representative.weather[0]?.description}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
                <span>{pop}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Hourly List */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {hourlyData.map((item, index) => {
            const temp = convertTemperature(item.main.temp, unit);
            const condition = item.weather[0]?.main || 'Unknown';
            const icon = item.weather[0]?.icon || '01d';
            const time = new Date(item.dt * 1000);
            const hour = time.getHours();
            const pop = Math.round((item.pop || 0) * 100);

            return (
              <div
                key={`${item.dt}-${index}`}
                className="flex-shrink-0 w-24 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center hover:shadow-md transition-shadow"
              >
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {index === 0 ? 'Now' : `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
                </p>
                <img
                  src={getWeatherIconUrl(icon)}
                  alt={condition}
                  className="w-8 h-8 mx-auto mb-2"
                />
                <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
                  {temp}°{unit}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                  <span>{pop}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

