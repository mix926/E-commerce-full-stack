'use client';

import Link from 'next/link';
import { Sparkles, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const QUICK_CATEGORIES = [
  { value: 'Electronics', key: 'category.electronics' },
  { value: 'Accessories', key: 'category.accessories' },
  { value: 'Clothing',    key: 'category.clothing' },
  { value: 'Home',        key: 'category.home' },
  { value: 'Sports',      key: 'category.sports' },
  { value: 'Books',       key: 'category.books' },
];

export default function NavCategoryBar() {
  const { t } = useLanguage();

  return (
    <>
      {/* Quick Categories Bar (Desktop) */}
      <div className="hidden md:flex items-center gap-6 py-2 border-t border-gray-100 text-xs font-medium text-gray-600 overflow-x-auto">
        <Link
          href="/products"
          className="text-blue-600 font-semibold hover:text-blue-700 transition-colors shrink-0 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          {t('nav.allProducts')}
        </Link>
        {QUICK_CATEGORIES.map((cat) => (
          <Link
            key={cat.value}
            href={`/products?category=${cat.value}`}
            className="hover:text-blue-600 transition-colors shrink-0"
          >
            {t(cat.key)}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-4 text-gray-400">
          <Link href="/faq" className="hover:text-gray-600 transition-colors">
            {t('nav.help')}
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">
            {t('nav.contact')}
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form action="/products" method="GET">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              name="search"
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-gray-50"
            />
          </div>
        </form>
      </div>
    </>
  );
}
