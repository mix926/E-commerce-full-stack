'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: Array<{
    label: string;
    options: FilterOption[];
    value?: string;
    onChange: (value: string) => void;
  }>;
  children?: ReactNode;
}

export default function FilterBar({ filters, children }: FilterBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex flex-wrap gap-3 items-center">
        {filters.map((filter, idx) => (
          <div key={idx} className="relative">
            <select
              value={filter.value || ''}
              onChange={(e) => filter.onChange(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}
