'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center animate-fade-in">
      {icon && <div className="mb-6 flex justify-center">{icon}</div>}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">{title}</h3>
      {description && (
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">{description}</p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

