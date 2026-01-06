'use client';

export function WeatherCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>
        <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
      <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
        ))}
      </div>
    </div>
  );
}

