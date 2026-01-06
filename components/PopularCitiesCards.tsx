'use client';

import { WeatherTableRow, TemperatureUnit } from '@/types/weather';
import { convertTemperature, getWeatherIconUrl } from '@/lib/utils';
import Card from './ui/Card';

interface PopularCitiesCardsProps {
  data: WeatherTableRow[];
  unit: TemperatureUnit;
  onCityClick?: (city: string) => void;
}

export default function PopularCitiesCards({ data, unit, onCityClick }: PopularCitiesCardsProps) {
  // Show only top 5 cities
  const top5Cities = data.slice(0, 5);

  if (data.length === 0) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center text-slate-600 dark:text-slate-400">
        No weather data available
      </div>
    );
  }

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear') || cond.includes('sun')) {
      return '01d';
    }
    if (cond.includes('cloud')) {
      return '02d';
    }
    if (cond.includes('rain') || cond.includes('drizzle')) {
      return '09d';
    }
    if (cond.includes('snow')) {
      return '13d';
    }
    return '01d';
  };

  return (
    <div>
      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {top5Cities.map((row, index) => {
          const temp = convertTemperature(row.temperature, unit);
          const icon = getWeatherIcon(row.condition);

          return (
            <Card
              key={`${row.city}-${index}`}
              className={`text-center ${onCityClick ? 'cursor-pointer' : ''}`}
              onClick={() => onCityClick?.(row.city)}
              onKeyDown={(e) => {
                if (onCityClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onCityClick(row.city);
                }
              }}
              role={onCityClick ? 'button' : undefined}
              tabIndex={onCityClick ? 0 : undefined}
              aria-label={onCityClick ? `View weather for ${row.city}` : undefined}
            >
              <div className="flex flex-col items-center">
                {/* City Name */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {row.city}
                </h3>

                {/* Weather Icon */}
                <img
                  src={getWeatherIconUrl(icon)}
                  alt={row.condition}
                  className="w-16 h-16 mb-3 drop-shadow-md"
                />

                {/* Temperature */}
                <div className="mb-4">
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
                    {temp}°{unit}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                    {row.condition}
                  </p>
                </div>

                {/* Weather Details */}
                <div className="w-full space-y-2 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Humidity</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {row.humidity}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Wind</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {row.windSpeed} m/s
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

