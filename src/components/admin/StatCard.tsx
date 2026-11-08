'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: { direction: 'up' | 'down' | 'neutral'; percentage: number };
  color: 'blue' | 'green' | 'violet' | 'amber' | 'rose';
}

const colorClasses = {
  blue:   'bg-blue-50   dark:bg-blue-950/40  text-blue-600   dark:text-blue-400',
  green:  'bg-green-50  dark:bg-green-950/40 text-green-600  dark:text-green-400',
  violet: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
  amber:  'bg-amber-50  dark:bg-amber-950/40 text-amber-600  dark:text-amber-400',
  rose:   'bg-rose-50   dark:bg-rose-950/40  text-rose-600   dark:text-rose-400',
};

const trendClasses = {
  up:      'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40',
  down:    'text-red-600   dark:text-red-400   bg-red-50   dark:bg-red-950/40',
  neutral: 'text-gray-600  dark:text-gray-400  bg-gray-50  dark:bg-gray-800',
};

export default function StatCard({ label, value, icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${trendClasses[trend.direction]}`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.percentage}%
          </div>
        )}
      </div>
    </div>
  );
}
