'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface NavCategoryBarProps {
  categories: string[];
  categoryTranslations?: Record<string, string>;
}

export default function NavCategoryBar({ categories, categoryTranslations = {} }: NavCategoryBarProps) {
  const { t, lang } = useLanguage();

  function getCategoryLabel(cat: string): string {
    // If Khmer, prefer DB translation, then hardcoded key, then raw name
    if (lang === 'km') {
      if (categoryTranslations[cat]) return categoryTranslations[cat];
      const key = `category.${cat.toLowerCase()}`;
      const translated = t(key);
      if (translated !== key) return translated;
    }
    return cat;
  }

  return (
    <>
      {/* Quick Categories Bar (Desktop) */}
      <div className="hidden md:flex justify-center items-center gap-4 sm:gap-5 px-4 py-3 border-t border-gray-100 text-xs font-medium text-gray-600 overflow-x-auto scrollbar-hide">
        <Link
          href="/products"
          className="text-blue-600 font-semibold hover:text-blue-700 transition-colors shrink-0 flex items-center gap-1.5 touch-target h-6"
        >
          <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
          {t('nav.allProducts')}
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/products?category=${encodeURIComponent(cat)}`}
            className="hover:text-blue-600 transition-colors shrink-0 whitespace-nowrap touch-target h-6 flex items-center"
          >
            {getCategoryLabel(cat)}
          </Link>
        ))}

        <div className="flex items-center gap-3 sm:gap-4 text-gray-400 shrink-0">
          <Link href="/faq" className="hover:text-gray-600 transition-colors touch-target h-6 flex items-center">
            {t('nav.help')}
          </Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors touch-target h-6 flex items-center">
            {t('nav.contact')}
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar removed — search accessible via hamburger menu */}
    </>
  );
}
