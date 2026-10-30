'use client';

import { Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NavSearchBar() {
  const { t } = useLanguage();

  return (
    <form
      action="/products"
      method="GET"
      className="flex-1 max-w-lg hidden md:flex items-center"
    >
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          name="search"
          type="text"
          placeholder={t('nav.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-gray-50/80 hover:bg-gray-50 transition-colors placeholder:text-gray-400"
        />
      </div>
    </form>
  );
}
