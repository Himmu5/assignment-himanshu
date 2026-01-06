'use client';

import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in ${
        hover ? 'hover:shadow-xl transition-shadow' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

