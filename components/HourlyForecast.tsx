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
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Hourly Forecast
      </h3>
      
      {/* Time Period Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
              className="bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">{period}</p>
              <img
                src={getWeatherIconUrl(icon)}
                alt={condition}
                className="w-12 h-12 mx-auto mb-3 drop-shadow-md"
              />
              <p className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                {convertTemperature(avgTemp, unit)}°{unit}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize mb-2 font-medium">
                {representative.weather[0]?.description}
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
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
                className="flex-shrink-0 w-28 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-700/80 dark:to-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {index === 0 ? 'Now' : `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`}
                </p>
                <img
                  src={getWeatherIconUrl(icon)}
                  alt={condition}
                  className="w-10 h-10 mx-auto mb-2 drop-shadow-md"
                />
                <p className="text-lg font-extrabold text-gray-900 dark:text-white mb-2">
                  {temp}°{unit}
                </p>
                <div className="flex items-center justify-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
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

