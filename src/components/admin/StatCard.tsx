'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    percentage: number;
  };
  color: 'blue' | 'green' | 'violet' | 'amber' | 'rose';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
};

const trendClasses = {
  up: 'text-green-600 bg-green-50',
  down: 'text-red-600 bg-red-50',
  neutral: 'text-gray-600 bg-gray-50',
};

export default function StatCard({ label, value, icon, trend, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>

      {/* Label */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>

      {/* Value and Trend */}
      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${trendClasses[trend.direction]}`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.percentage}%
          </div>
        )}
      </div>
    </div>
  );
}
