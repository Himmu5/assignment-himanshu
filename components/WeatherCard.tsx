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

  // Get gradient based on weather condition - more subtle
  const getConditionGradient = () => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear') || cond.includes('sun')) {
      return 'from-amber-100/50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-900/20';
    }
    if (cond.includes('cloud')) {
      return 'from-blue-100/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20';
    }
    if (cond.includes('rain') || cond.includes('drizzle')) {
      return 'from-cyan-100/50 to-blue-100/50 dark:from-cyan-900/20 dark:to-blue-900/20';
    }
    return 'from-slate-100/50 to-gray-100/50 dark:from-slate-800/20 dark:to-gray-800/20';
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getConditionGradient()} opacity-5 dark:opacity-10 -z-0`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
              {weather.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {weather.sys.country}
            </p>
          </div>
          <div className="relative">
            <img
              src={getWeatherIconUrl(icon)}
              alt={condition}
              className="w-24 h-24 drop-shadow-lg animate-scale-in"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-6xl font-extrabold text-slate-900 dark:text-slate-100">
              {temp}
            </span>
            <span className="text-3xl font-semibold text-slate-600 dark:text-slate-400">
              °{unit}
            </span>
          </div>
          <p className="text-xl text-slate-700 dark:text-slate-300 capitalize font-medium">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Feels Like</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {feelsLike}°{unit}
            </p>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Humidity</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {weather.main.humidity}%
            </p>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Wind Speed</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {weather.wind.speed} m/s
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{getWindDirection(weather.wind.deg)}</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Pressure</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {weather.main.pressure} hPa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Visibility</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {weather.visibility ? (weather.visibility / 1000).toFixed(1) : 'N/A'} km
            </p>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">Cloudiness</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {weather.clouds.all}%
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300 font-medium">High: {tempMax}°{unit}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Low: {tempMin}°{unit}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{formatTime(weather.sys.sunrise)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-orange-500 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{formatTime(weather.sys.sunset)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

