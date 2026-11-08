'use client';

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

export default function AdminHeader({ title, subtitle, breadcrumbs, actions }: AdminHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-1">
                {idx > 0 && <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />}
                <span className={`text-xs font-medium ${crumb.href ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700' : 'text-gray-600 dark:text-gray-400'}`}>
                  {crumb.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Title and Actions */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
