'use client';

import { Product } from '@prisma/client';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import SortSelect from '@/components/SortSelect';
import { useLanguage } from '@/context/LanguageContext';

interface ProductsContentProps {
  products: Product[];
  totalCount: number;
  search: string;
  category: string;
  sort: string;
}

export default function ProductsContent({ products, totalCount, search, category, sort }: ProductsContentProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                {category || t('products.title')}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {totalCount} {t('products.found')}
                {search && <span className="text-blue-600"> {t('products.for')} &ldquo;{search}&rdquo;</span>}
              </p>
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-3 flex-wrap">
              <form method="GET" action="/products" className="flex items-center">
                {category && <input type="hidden" name="category" value={category} />}
                {sort !== 'newest' && <input type="hidden" name="sort" value={sort} />}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="search"
                    type="text"
                    defaultValue={search}
                    placeholder={t('products.search')}
                    className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-44 shadow-sm"
                  />
                </div>
              </form>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <Suspense fallback={<div className="w-36 h-10 bg-gray-100 rounded-xl animate-pulse" />}>
                  <SortSelect defaultValue={sort} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {products.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('products.noFound')}</h3>
            <p className="text-gray-400 mb-6 text-sm">{t('products.noFoundDesc')}</p>
            <Link href="/products"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-md shadow-blue-500/25">
              {t('products.clearFilters')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
