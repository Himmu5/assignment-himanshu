'use client';

import { ReactNode } from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  action?: ReactNode;
}

export default function ErrorMessage({ message, onDismiss, action }: ErrorMessageProps) {
  return (
    <div
      className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg flex items-center justify-between animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-2 flex-1">
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <p className="flex-1">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {action}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

