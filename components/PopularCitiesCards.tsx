'use client';

import { useState } from 'react';
import { WeatherTableRow, TemperatureUnit } from '@/types/weather';
import { convertTemperature, getWeatherIconUrl } from '@/lib/utils';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import Card from './ui/Card';
import Button from './ui/Button';

interface PopularCitiesCardsProps {
  data: WeatherTableRow[];
  unit: TemperatureUnit;
  onCityClick?: (city: string) => void;
}

export default function PopularCitiesCards({ data, unit, onCityClick }: PopularCitiesCardsProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev - 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

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
    <div className="space-y-6">
      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {currentData.map((row, index) => {
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-700 dark:text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

